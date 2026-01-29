import * as fs from 'fs';
import * as path from 'path';
import { promises as fsp } from 'fs';
import { FMItem, FMType } from './file-manager.types';
import { extension as mimeExtension } from 'mime-types';
import { BadRequestException } from '@nestjs/common';
import * as diskusage from 'diskusage';

function sanitizeName(name: string) {
  // eslint-disable-next-line no-useless-escape
  const s = (name || '').replace(/[\/\\\0]/g, '').trim();
  if (!s) throw new BadRequestException('Invalid name');
  if (s === '.' || s === '..') throw new BadRequestException('Invalid name');
  return s;
}

function normalizeId(raw: string | undefined) {
  const decoded = decodeURIComponent(raw ?? '/');
  let id = decoded.startsWith('/') ? decoded : `/${decoded}`;
  id = id.replace(/\/+/g, '/'); // collapse //
  if (id.length > 1) id = id.replace(/\/$/, ''); // bỏ trailing / (trừ root)
  return id;
}

export function ensureExt(
  inputName: string,
  originalName: string,
  mimeType?: string,
) {
  const safe = sanitizeName(inputName);

  // nếu đã có .ext thì giữ nguyên
  if (path.extname(safe)) return safe;

  // lấy ext từ originalname
  const extFromOrig = path.extname(originalName || '');
  if (extFromOrig) return safe + extFromOrig;

  // fallback: lấy ext từ mimetype
  const extFromMime = mimeExtension(mimeType || '');
  if (extFromMime) return `${safe}.${extFromMime}`;

  return safe; // không đoán được thì thôi
}

export class FileManagerService {
  constructor(private readonly rootAbs: string) {}

  private toAbs(idRaw?: string) {
    const id = normalizeId(idRaw);
    const rel = id.replace(/^\/+/, ''); // "/a/b" -> "a/b"
    const abs = path.resolve(this.rootAbs, rel);

    const root = this.rootAbs.endsWith(path.sep)
      ? this.rootAbs
      : this.rootAbs + path.sep;
    if (abs !== this.rootAbs && !abs.startsWith(root)) {
      throw new BadRequestException('Invalid path');
    }
    return { id, abs };
  }

  private async assertDir(idRaw?: string) {
    const { abs } = this.toAbs(idRaw ?? '/');
    let st: fs.Stats;
    try {
      st = await fsp.stat(abs);
    } catch {
      throw new BadRequestException('Folder not found');
    }
    if (!st.isDirectory())
      throw new BadRequestException('Target is not a folder');
  }

  private joinId(parentId: string, name: string) {
    if (parentId === '/') return `/${name}`;
    return `${parentId}/${name}`;
  }

  async list(folderIdRaw?: string, text?: string): Promise<FMItem[]> {
    const { id: folderId, abs } = this.toAbs(folderIdRaw ?? '/');

    const entries = await fsp.readdir(abs, { withFileTypes: true });
    const q = (text ?? '').toLowerCase();
    const filtered = q
      ? entries.filter((e) => e.name.toLowerCase().includes(q))
      : entries;

    const out: FMItem[] = [];
    for (const e of filtered) {
      const childId = this.joinId(folderId, e.name);
      const st = await fsp.stat(this.toAbs(childId).abs);

      if (e.isDirectory()) {
        out.push({
          id: childId,
          type: 'folder',
          value: e.name,
          lazy: true,
          date: st.mtimeMs,
        });
      } else {
        out.push({
          id: childId,
          type: 'file',
          value: e.name,
          size: st.size,
          date: st.mtimeMs,
        });
      }
    }

    // sort: folder trước, file sau, theo tên
    out.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.value.localeCompare(b.value);
    });

    return out;
  }

  async create(
    parentFolderIdRaw: string | undefined,
    name: string,
    type: FMType,
  ) {
    const parent = normalizeId(parentFolderIdRaw ?? '/');
    await this.assertDir(parent);

    const safe = sanitizeName(name);
    if (!safe) throw new BadRequestException('Invalid name');

    const newId = this.joinId(parent, safe);
    const { abs } = this.toAbs(newId);

    if (type === 'folder') {
      await fsp.mkdir(abs, { recursive: true });
    } else {
      await fsp.mkdir(path.dirname(abs), { recursive: true });
      await fsp.writeFile(abs, Buffer.from(''));
    }

    return { result: { id: newId, name: safe } };
  }

  async upload(
    folderIdRaw: string | undefined,
    originalName: string,
    buf: Buffer,
  ) {
    const folderId = normalizeId(folderIdRaw ?? '/');
    await this.assertDir(folderId);

    const safe = sanitizeName(originalName);
    if (!safe) throw new BadRequestException('Invalid name');

    const fileId = this.joinId(folderId, safe);
    const { abs } = this.toAbs(fileId);

    await fsp.mkdir(path.dirname(abs), { recursive: true });
    await fsp.writeFile(abs, buf);

    return { id: fileId, name: safe };
  }

  async rename(idRaw: string, newName: string) {
    const { id, abs: oldAbs } = this.toAbs(idRaw);
    const safe = sanitizeName(newName);
    if (!safe) throw new BadRequestException('Invalid name');

    const parent = path.posix.dirname(id);
    const newId = parent === '/' ? `/${safe}` : `${parent}/${safe}`;
    const { abs: newAbs } = this.toAbs(newId);

    await fsp.rename(oldAbs, newAbs);

    // SVAR expect { result: { id, name } } :contentReference[oaicite:1]{index=1}
    return { result: { id: newId, name: safe } };
  }

  private async moveOne(srcAbs: string, dstAbs: string) {
    try {
      await fsp.rename(srcAbs, dstAbs);
    } catch (e: any) {
      // cross-device: fallback copy + rm
      if (e?.code === 'EXDEV') {
        await fsp.cp(srcAbs, dstAbs, {
          recursive: true,
          errorOnExist: false,
        });
        await fsp.rm(srcAbs, { recursive: true, force: true });
        return;
      }
      throw e;
    }
  }

  async moveCopy(
    operation: 'move' | 'copy',
    targetRaw: string,
    idsRaw: string[],
  ) {
    const target = normalizeId(targetRaw);
    await this.assertDir(target);

    const { abs: targetAbs } = this.toAbs(target);
    await fsp.mkdir(targetAbs, { recursive: true });

    const result: Array<{ id: string; name: string }> = [];

    for (const raw of idsRaw) {
      const srcId = normalizeId(raw);

      if (operation === 'move') {
        // target nằm trong src => cấm
        if (target === srcId || target.startsWith(srcId + '/')) {
          throw new BadRequestException('Cannot move a folder into itself');
        }
      }

      const base = path.posix.basename(srcId);
      const dstId = this.joinId(target, base);

      const { abs: srcAbs } = this.toAbs(srcId);
      const { abs: dstAbs } = this.toAbs(dstId);

      if (operation === 'move') {
        await this.moveOne(srcAbs, dstAbs);
      } else {
        await fsp.cp(srcAbs, dstAbs, {
          recursive: true,
          errorOnExist: false,
        });
      }

      result.push({ id: dstId, name: base });
    }

    return { result };
  }

  async delete(idsRaw: string[]) {
    for (const raw of idsRaw) {
      const id = normalizeId(raw);
      if (id === '/') throw new BadRequestException('Cannot delete root');

      const { abs } = this.toAbs(id);
      await fsp.rm(abs, { recursive: true, force: true });
    }
    return {};
  }

  async infoDrive() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { available, free, total } = await diskusage.check(this.rootAbs);

      // diskusage trả:
      // available: bytes available to unprivileged user
      // free: bytes free (có thể khác available)
      // total: total bytes

      const used = total - free;
      return { stats: { free, total, used } };
    } catch {
      return { stats: { free: 0, total: 0, used: 0 } };
    }
  }

  async infoFolder(idRaw?: string) {
    const { abs } = this.toAbs(idRaw ?? '/');
    const entries = await fsp.readdir(abs, { withFileTypes: true });

    let size = 0;

    for (const e of entries) {
      const full = path.join(abs, e.name);
      const st = await fsp.stat(full);
      if (st.isFile()) {
        size += st.size;
      }
    }

    return { stats: { Size: size, Count: entries.length } }; // Count có thể là total items
  }

  ensureRootExists() {
    fs.mkdirSync(this.rootAbs, { recursive: true });
  }
}

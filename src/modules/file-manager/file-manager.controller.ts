import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import express from 'express';
import { ensureExt, FileManagerService } from './file-manager.service';

@Controller('file-manager')
export class FileManagerController {
  constructor(private readonly svc: FileManagerService) {}

  // GET /files (root) :contentReference[oaicite:2]{index=2}
  @Get('files')
  listRoot(@Query('text') text?: string) {
    return this.svc.list('/', text);
  }

  // GET /files/{id} :contentReference[oaicite:3]{index=3}
  // @Get('files/*id')
  //   listFolder(@Param('id') id: string, @Query('text') text?: string) {
  //   return id;
  //   return this.svc.list(id, text);
  // }

  @Get('files/*id')
  listFolder(@Param() params: Record<string, any>, @Query('text') text?: string) {
    const raw = params.id;
    const normalized = Array.isArray(raw) ? raw.join('/') : raw;
    return this.svc.list('/' + normalized, text);
  }

  // POST /files/{id} create in folder :contentReference[oaicite:4]{index=4}
  @Post('files/*id')
  createInFolder(
    @Param('id') id: string,
    @Body() body: { name: string; type: 'file' | 'folder' },
  ) {
    return this.svc.create(id, body.name, body.type);
  }

  // (fallback) POST /files create in root (để chắc chắn không bị vướng root id)
  @Post('files')
  createInRoot(@Body() body: { name: string; type: 'file' | 'folder' }) {
    return this.svc.create('/', body.name, body.type);
  }

  // (fallback) POST /upload upload to root
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  upload(
    @Query('id') id: string | undefined,
    @Body('name') name: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const folderId = id ?? '/';
    const finalName = ensureExt(
      name || file.originalname,
      file.originalname,
      file.mimetype,
    );
    return this.svc.upload(folderId, finalName, file.buffer);
  }

  // PUT /files/{id} rename :contentReference[oaicite:6]{index=6}
  @Put('files/*id')
  rename(
    @Param('id') id: string,
    @Body() body: { operation: 'rename'; name: string },
  ) {
    return this.svc.rename(id, body.name);
  }

  // PUT /files move/copy :contentReference[oaicite:7]{index=7}
  @Put('files')
  moveCopy(
    @Body() body: { operation: 'move' | 'copy'; target: string; ids: string[] },
  ) {
    return this.svc.moveCopy(body.operation, body.target, body.ids);
  }

  // DELETE /files delete :contentReference[oaicite:8]{index=8}
  @Delete('files')
  del(@Body() body: { ids: string[] }) {
    return this.svc.delete(body.ids);
  }

  // GET /info and /info/{id} :contentReference[oaicite:9]{index=9}
  @Get('info')
  infoDrive() {
    return this.svc.infoDrive();
  }

  @Get('info/*id')
  infoFolder(@Param('id') id: string) {
    return this.svc.infoFolder(id);
  }
}

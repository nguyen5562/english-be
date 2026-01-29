export type FMType = 'file' | 'folder';

export type FMItem = {
  id: string; // bắt buộc: path dạng "/a/b"
  type: FMType; // "file" | "folder"
  value: string; // tên hiển thị
  size?: number; // bytes (file)
  count?: number; // số item (folder) - optional
  lazy?: boolean; // optional
  date?: number; // unix seconds
};

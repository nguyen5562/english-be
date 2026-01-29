import * as path from 'path';
import 'dotenv/config';

if (!process.env.FILE_ROOT) {
  throw new Error('FILE_ROOT is required in environment variables');
}

export const FILE_ROOT = path.join(process.cwd(), process.env.FILE_ROOT);

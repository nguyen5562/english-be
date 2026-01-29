import { Module } from '@nestjs/common';
import { FileManagerController } from './file-manager.controller';
import { FileManagerService } from './file-manager.service';
import { FILE_ROOT } from 'src/configs/file-manager.config';

@Module({
  controllers: [FileManagerController],
  providers: [
    {
      provide: FileManagerService,
      useFactory: () => {
        const svc = new FileManagerService(FILE_ROOT);
        svc.ensureRootExists();
        return svc;
      },
    },
  ],
  exports: [FileManagerService],
})
export class FileManagerModule {}

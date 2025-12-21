import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): { status: string; message: string } {
    return {
      status: 'ok',
      message: 'Server is running',
    };
  }
}

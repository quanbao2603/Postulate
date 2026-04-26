import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) { }

  @Get('health')
  async getHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        message: 'Máy chủ Postulate API đang hoạt động mượt mà!',
        database: 'connected',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: 'Máy chủ đang chạy nhưng không thể kết nối tới Database.',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

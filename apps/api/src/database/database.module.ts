import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Biến Module này thành Global để không phải import lại ở từng Module con
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}

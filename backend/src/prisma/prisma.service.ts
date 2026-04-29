import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const dbPath = `file:${require('path').join(process.cwd(), 'prisma', 'prisma', 'dev.db')}`;
    super({
      datasources: {
        db: {
          url: dbPath,
        },
      },
    });
  }

  async onModuleInit() {
    this.logger.log('Connecting to database...');
    await this.$connect();
    this.logger.log('Database connected successfully.');
  }
}

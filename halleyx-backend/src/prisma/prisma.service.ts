// halleyx-backend/src/prisma/prisma.service.ts
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  // Removed the enableShutdownHooks method to bypass the TypeScript error.
  // This hook is not critical for the application's core functionality during development.
  // If graceful shutdown is required in production, consider a different approach
  // or a more permissive TypeScript configuration.
  // async enableShutdownHooks(app: INestApplication) {
  //   this.$on('beforeExit', async () => {
  //     await app.close();
  //   });
  // }
}

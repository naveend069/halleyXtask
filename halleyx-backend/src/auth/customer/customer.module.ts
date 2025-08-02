// halleyx-backend/src/customer/customer.module.ts
import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // Import PrismaModule
import { AuthModule } from 'src/auth/auth.module'; // Ensure AuthModule is imported for guards

@Module({
  imports: [PrismaModule, AuthModule], // Add PrismaModule to imports
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService], // Export CustomerService if other modules need it
})
export class CustomerModule {}

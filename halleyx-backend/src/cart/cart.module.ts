// halleyx-backend/src/cart/cart.module.ts
import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // For JwtAuthGuard
import { ProductModule } from '../product/product.module'; // For ProductService

@Module({
  imports: [PrismaModule, AuthModule, ProductModule], // Import necessary modules
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService], // Export CartService if OrderModule needs it later
})
export class CartModule {}
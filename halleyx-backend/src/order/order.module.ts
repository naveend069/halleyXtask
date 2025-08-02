// halleyx-backend/src/order/order.module.ts
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../prisma/prisma.service';
// import { CartService } from '../cart/cart.service'; // <--- REMOVE THIS IMPORT
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    PrismaService,
    // CartService, // <--- REMOVE THIS LINE
  ],
  exports: [OrderService],
})
export class OrderModule {}
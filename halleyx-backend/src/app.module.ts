// halleyx-backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CustomerModule } from './auth/customer/customer.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module'; // <--- NEW IMPORT

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    CustomerModule,
    ProductModule,
    CartModule,
    OrderModule, // <--- ADD OrderModule HERE
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
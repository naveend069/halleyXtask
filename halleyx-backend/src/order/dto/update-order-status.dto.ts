// halleyx-backend/src/order/dto/update-order-status.dto.ts
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '@prisma/client'; // Import OrderStatus enum

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus, { message: 'Invalid order status' })
  status: OrderStatus;
}
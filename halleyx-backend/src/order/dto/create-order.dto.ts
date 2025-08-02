// halleyx-backend/src/order/dto/create-order.dto.ts
import { IsNotEmpty, IsArray, ArrayMinSize, IsUUID, IsInt, Min } from 'class-validator';

// This DTO is for when you might want to create an order with specific items,
// but for our current "order from cart" flow, the cart items will be derived.
// We'll keep it simple for now as the cart contents will drive the order creation.
// However, it's good practice to have a DTO even if it's empty initially or minimal.

export class CreateOrderDto {
  // For a "create order from cart" scenario, the body might be empty
  // or contain just a confirmation. We'll derive items from the cart.
  // If you later add options like shipping address, those would go here.
}
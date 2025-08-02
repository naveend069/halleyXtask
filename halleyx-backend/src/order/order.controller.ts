// halleyx-backend/src/order/order.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role, OrderStatus } from '@prisma/client'; // Import Role and OrderStatus enums

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.CUSTOMER) // Only customers can create orders
  createOrder(@Req() req) {
    const customerId = req.user.id; // Get customer ID from authenticated user
    return this.orderService.createOrderFromCart(customerId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.CUSTOMER) // Only customers can view their own orders
  getOrders(@Req() req) {
    const customerId = req.user.id; // Get customer ID from authenticated user
    return this.orderService.getOrdersByCustomerId(customerId); // Corrected method name
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN) // Only admins can view all orders
  getAllOrdersForAdmin() { // Corrected method name
    return this.orderService.getAllOrdersForAdmin();
  }

  @Patch(':orderId/status')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN) // Only admins can update order status
  updateOrderStatus(@Param('orderId') orderId: string, @Body('status') status: OrderStatus) {
    return this.orderService.updateOrderStatus(orderId, status);
  }
}

// halleyx-backend/src/auth/customer/customer.controller.ts
import { Controller, Get, Param, Patch, Delete, UseGuards, Body, Post, BadRequestException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../../auth/get-user.decorator';
import { Customer } from '@prisma/client';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('api/customer') // Base route for customer operations
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/register') // Public endpoint for customer registration (if not handled by auth module)
  register(@Body() createCustomerDto: CreateCustomerDto) {
    // This endpoint is typically handled by AuthService.register
    return { message: 'Customer registration endpoint (if needed)' };
  }

  @Get('/me') // Endpoint for logged-in customer to get their own profile
  @UseGuards(JwtAuthGuard)
  getMe(@GetUser() user: Customer) { // GetUser decorator extracts user from request
    // The user object comes directly from JwtStrategy.validate, which returns the full user object.
    // We do NOT need to call customerService.findOne here.
    return user;
  }

  @Get('/admin/all') // Admin-only endpoint to get all customers
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAllCustomers() {
    return this.customerService.findAll();
  }

  @Get(':id') // Endpoint to get a single customer by ID (can be admin or customer accessing their own)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CUSTOMER) // Allow admin to get any customer, customer to get their own
  findOne(@Param('id') id: string, @GetUser() user: Customer) {
    // If customer is trying to access, ensure they can only access their own profile
    if (user.role === Role.CUSTOMER && user.id !== id) {
      throw new BadRequestException('Forbidden: You can only access your own profile.');
    }
    // Call the service method to find the customer by ID
    return this.customerService.findOne(id);
  }

  @Patch('/admin/:id/block') // Admin-only endpoint to block a customer
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  blockCustomer(@Param('id') id: string) {
    return this.customerService.block(id);
  }

  @Delete('/admin/:id') // Admin-only endpoint to delete a customer
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  removeCustomer(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}

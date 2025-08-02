// halleyx-backend/src/auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Role } from '@prisma/client';
// Corrected import paths: DTOs are in './customer/dto/' relative to auth.controller.ts
import { CreateCustomerDto } from './customer/dto/create-customer.dto';
import { LoginAuthDto } from './customer/dto/login-auth.dto';

@Controller('auth') // Base route for authentication operations
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register') // Public endpoint for customer registration
  register(@Body() createCustomerDto: CreateCustomerDto) {
    return this.authService.register(createCustomerDto);
  }

  @Post('/customer-login') // Public endpoint for customer login
  customerLogin(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.customerLogin(loginAuthDto);
  }

  @Post('/admin-login') // Public endpoint for admin login
  adminLogin(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.adminLogin(loginAuthDto);
  }

  @Get('/profile') // Protected endpoint to get user profile
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('/customers') // Admin-only endpoint to get all customers
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getAllCustomers() {
    return this.authService.getAllCustomers();
  }
}

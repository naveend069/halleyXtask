// halleyx-backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
// Corrected import paths: DTOs are in './customer/dto/' relative to auth.service.ts
import { CreateCustomerDto } from './customer/dto/create-customer.dto';
import { LoginAuthDto } from './customer/dto/login-auth.dto';
import { Role } from '@prisma/client'; // Import Role enum

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createCustomerDto: CreateCustomerDto) {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { email: createCustomerDto.email },
    });

    if (existingCustomer) {
      throw new BadRequestException('Email already registered.');
    }

    const hashedPassword = await bcrypt.hash(createCustomerDto.password, 10);

    const customer = await this.prisma.customer.create({
      data: {
        email: createCustomerDto.email,
        password: hashedPassword,
        firstName: createCustomerDto.firstName,
        lastName: createCustomerDto.lastName,
        role: Role.CUSTOMER, // Default role for registration
        status: 'ACTIVE', // Default status for new customers
      },
    });

    // Automatically create a cart for the new customer
    await this.prisma.cart.create({
      data: {
        customerId: customer.id,
      },
    });

    return { message: 'Registration successful. Please log in.', customerId: customer.id };
  }

  async customerLogin(loginAuthDto: LoginAuthDto) {
    const customer = await this.prisma.customer.findUnique({ where: { email: loginAuthDto.email } });

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (customer.status === 'BLOCKED') {
      throw new UnauthorizedException('Your account has been blocked. Please contact support.');
    }

    const isPasswordValid = await bcrypt.compare(loginAuthDto.password, customer.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: customer.id, email: customer.email, role: customer.role };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async adminLogin(loginAuthDto: LoginAuthDto) {
    const admin = await this.prisma.admin.findUnique({ where: { email: loginAuthDto.email } });

    if (!admin || admin.role !== Role.ADMIN) {
      throw new UnauthorizedException('Invalid credentials or not an administrator');
    }

    const isPasswordValid = await bcrypt.compare(loginAuthDto.password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: admin.id, email: admin.email, role: admin.role };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(payload: any): Promise<any> {
    if (payload.role === Role.ADMIN) {
      return this.prisma.admin.findUnique({ where: { id: payload.sub } });
    } else if (payload.role === Role.CUSTOMER) {
      return this.prisma.customer.findUnique({ where: { id: payload.sub } });
    }
    return null;
  }

  async getAllCustomers() {
    return this.prisma.customer.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

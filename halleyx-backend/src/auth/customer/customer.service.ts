// halleyx-backend/src/auth/customer/customer.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto'; // Assuming you have this DTO

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  /**
   * Finds a single customer by their unique ID.
   * Throws NotFoundException if customer not found.
   * Throws BadRequestException if ID is invalid.
   */
  async findOne(id: string) {
    // Ensure ID is not undefined or empty before querying Prisma
    if (!id) {
      throw new BadRequestException('Customer ID cannot be empty or undefined.');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  /**
   * Retrieves all customers from the database.
   */
  async findAll() {
    return this.prisma.customer.findMany();
  }

  /**
   * Updates an existing customer's information.
   * Throws NotFoundException if customer with given ID does not exist.
   */
  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const existingCustomer = await this.prisma.customer.findUnique({ where: { id } });
    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  /**
   * Blocks a customer by setting their status to 'BLOCKED'.
   * Throws NotFoundException if customer not found.
   */
  async block(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return this.prisma.customer.update({
      where: { id },
      data: { status: 'BLOCKED' },
    });
  }

  /**
   * Deletes a customer from the database.
   * Throws NotFoundException if customer not found.
   */
  async remove(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return this.prisma.customer.delete({ where: { id } });
  }
}

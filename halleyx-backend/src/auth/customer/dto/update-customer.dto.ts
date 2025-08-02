// halleyx-backend/src/customer/dto/update-customer.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Role } from '@prisma/client'; // Import Role enum

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEnum(Role) // Validate if the role is a valid enum value
  role?: Role;

  @IsOptional()
  @IsString() // Assuming status is a string like 'ACTIVE' or 'BLOCKED'
  status?: string;
}

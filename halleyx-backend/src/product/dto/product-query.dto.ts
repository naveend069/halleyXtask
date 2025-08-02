// halleyx-backend/src/product/dto/product-query.dto.ts
import { IsOptional, IsNumber, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20; // Default to 20 items per page as per challenge

  @IsOptional()
  @IsString()
  search?: string; // Search by product name or description

  @IsOptional()
  @IsString()
  @IsIn(['name', 'price', 'stockQuantity', 'createdAt', 'updatedAt']) // Allowed sort fields
  sortBy?: string = 'createdAt'; // Default sort

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc']) // Allowed sort order
  sortOrder?: 'asc' | 'desc' = 'desc'; // Default order
}
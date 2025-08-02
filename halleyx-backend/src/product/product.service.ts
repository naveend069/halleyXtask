import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.prisma.product.findFirst({
      where: { name: createProductDto.name },
    });

    if (existingProduct) {
      throw new BadRequestException(`Product with name "${createProductDto.name}" already exists.`);
    }

    return this.prisma.product.create({ data: createProductDto });
  }

  findAll() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    console.log('ProductService: Updating product with ID:', id);
    console.log('ProductService: Update data:', updateProductDto);
    
    const existingProduct = await this.prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      console.log('ProductService: Product not found');
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    console.log('ProductService: Existing product:', existingProduct);

    if (updateProductDto.name && updateProductDto.name !== existingProduct.name) {
      const productWithSameName = await this.prisma.product.findFirst({
        where: { name: updateProductDto.name },
      });
      if (productWithSameName) {
        console.log('ProductService: Product with same name exists');
        throw new BadRequestException(`Product with name "${updateProductDto.name}" already exists.`);
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    console.log('ProductService: Product updated successfully:', updatedProduct);
    return updatedProduct;
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return this.prisma.product.delete({ where: { id } });
  }
}

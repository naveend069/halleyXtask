// halleyx-backend/src/order/order.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus } from '@prisma/client'; // Import OrderStatus enum

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrderFromCart(customerId: string) {
    // 1. Fetch the customer's cart with items and product details
    const cart = await this.prisma.cart.findUnique({
      where: { customerId: customerId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty. Cannot create an order.');
    }

    // 2. Validate product stock and calculate total amount
    let totalAmount = 0;
    const orderItemsData: { productId: string; quantity: number; }[] = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product;

      if (!product) {
        throw new NotFoundException(`Product not found for cart item ${cartItem.id}`);
      }
      if (product.stockQuantity < cartItem.quantity) {
        throw new BadRequestException(`Not enough stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${cartItem.quantity}`);
      }

      totalAmount += product.price * cartItem.quantity;
      orderItemsData.push({
        productId: product.id,
        quantity: cartItem.quantity,
      });
    }

    // 3. Create the order and update product stocks within a transaction
    const newOrder = await this.prisma.$transaction(async (prisma) => {
      // Create the order
      const order = await prisma.order.create({
        data: {
          customerId: customerId,
          totalAmount: totalAmount,
          status: OrderStatus.PENDING, // Initial status
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: true, // Include customer for the response
        },
      });

      // Update product stocks within the transaction
      for (const cartItem of cart.items) {
        await prisma.product.update({
          where: { id: cartItem.productId },
          data: { stockQuantity: { decrement: cartItem.quantity } },
        });
      }

      // Clear the customer's cart after order creation
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });

    // Flatten the order object for the response
    return {
      id: newOrder.id,
      customerId: newOrder.customerId,
      customerEmail: newOrder.customer?.email, // Access from included customer
      customerName: `${newOrder.customer?.firstName || ''} ${newOrder.customer?.lastName || ''}`.trim(),
      totalAmount: newOrder.totalAmount,
      status: newOrder.status,
      createdAt: newOrder.createdAt,
      items: newOrder.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        productImageUrl: item.product.imageUrl,
      })),
    };
  }

  async getOrdersByCustomerId(customerId: string) {
    const orders = await this.prisma.order.findMany({
      where: { customerId: customerId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(order => ({
      id: order.id,
      customerId: order.customerId,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        productImageUrl: item.product.imageUrl,
      })),
    }));
  }

  async getOrderById(orderId: string, customerId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId, customerId: customerId }, // Ensure order belongs to customer
      include: {
        items: {
            include: {
                product: true,
            },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found for this customer.`);
    }

    return {
      id: order.id,
      customerId: order.customerId,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        productImageUrl: item.product.imageUrl,
      })),
    };
  }

  // Admin-specific: Get all orders
  async getAllOrdersForAdmin() {
    const orders = await this.prisma.order.findMany({
      include: {
        customer: true, // Include customer details
        items: {
          include: {
            product: true, // Include product details for each item
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(order => ({
      id: order.id,
      customerId: order.customerId,
      customerEmail: order.customer?.email, // Add customer email directly
      customerName: `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim(), // Add customer name
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        productImageUrl: item.product.imageUrl,
      })),
    }));
  }

  // Admin-specific: Update order status
  async updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true, items: { include: { product: true } } }, // Include customer and items for response mapping
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    if (!Object.values(OrderStatus).includes(newStatus)) {
      throw new BadRequestException(`Invalid status: ${newStatus}`);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: { customer: true, items: { include: { product: true } } }, // Re-include for consistent response
    });

    return {
      id: updatedOrder.id,
      customerId: updatedOrder.customerId,
      customerEmail: updatedOrder.customer?.email,
      customerName: `${updatedOrder.customer?.firstName || ''} ${updatedOrder.customer?.lastName || ''}`.trim(),
      totalAmount: updatedOrder.totalAmount,
      status: updatedOrder.status,
      createdAt: updatedOrder.createdAt,
      items: updatedOrder.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        productImageUrl: item.product.imageUrl,
      })),
    };
  }
}

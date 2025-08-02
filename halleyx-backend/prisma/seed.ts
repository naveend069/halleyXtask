import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.admin.deleteMany();

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
    },
  });

  // Create Customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.customer.create({
    data: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: Role.CUSTOMER,
      status: 'ACTIVE',
    },
  });

  // Create Products
  await prisma.product.createMany({
    data: [
      {
        name: 'Wireless Headphones',
        description: 'Bluetooth over-ear headphones with noise cancellation.',
        price: 99.99,
        stockQuantity: 50,
        imageUrl: 'https://images.unsplash.com/photo-1585386959984-a41552263f5e?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Smart Watch',
        description: 'Track fitness and health with this smart wearable.',
        price: 199.99,
        stockQuantity: 30,
        imageUrl: 'https://images.unsplash.com/photo-1516222338253-1b8b3fc6a5e3?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Laptop Stand',
        description: 'Ergonomic aluminum laptop stand for desk setups.',
        price: 39.99,
        stockQuantity: 100,
        imageUrl: 'https://images.unsplash.com/photo-1587614382346-4ec1fdc4cbd7?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'USB-C Hub',
        description: 'Multi-port adapter with HDMI, USB, and SD reader.',
        price: 29.99,
        stockQuantity: 80,
        imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b09?auto=format&fit=crop&w=400&q=80',
      },
    ],
  });

  // Create empty cart for customer
  await prisma.cart.create({
    data: {
      customerId: customer.id,
    },
  });

  console.log('✅ Seeding complete');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

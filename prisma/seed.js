import bcrypt from 'bcrypt';
import 'dotenv/config';
import prisma from '../src/config/db.js';

try {
  await prisma.$queryRaw`
    TRUNCATE TABLE order_products, orders, products, categories, users
    RESTART IDENTITY CASCADE;
  `;

  // Create Categories
  const electronics = await prisma.category.create({
    data: { name: 'Electronics' },
  });

  const clothing = await prisma.category.create({
    data: { name: 'Clothing' },
  });

  const books = await prisma.category.create({
    data: { name: 'Books' },
  });

  // Create Products
  const laptop = await prisma.product.create({
    data: {
      name: 'Laptop',
      price: '999.99',
      categoryId: electronics.id,
    },
  });

  const mouse = await prisma.product.create({
    data: {
      name: 'Wireless Mouse',
      price: '29.99',
      categoryId: electronics.id,
    },
  });

  const tshirt = await prisma.product.create({
    data: {
      name: 'T-Shirt',
      price: '19.99',
      categoryId: clothing.id,
    },
  });

  const jeans = await prisma.product.create({
    data: {
      name: 'Jeans',
      price: '49.99',
      categoryId: clothing.id,
    },
  });

  const book = await prisma.product.create({
    data: {
      name: 'Node.js Guide',
      price: '39.99',
      categoryId: books.id,
    },
  });

  // Create Users with known credentials
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
    },
  });

  // Create Orders for users (ownership-based authorization)
  const adminOrder = await prisma.order.create({
    data: {
      userId: adminUser.id,
    },
  });

  const userOrder = await prisma.order.create({
    data: {
      userId: regularUser.id,
    },
  });

  // Create Order Products (items in orders)
  await prisma.orderProduct.create({
    data: {
      itemId: laptop.id,
      orderId: adminOrder.id,
      categoryId: electronics.id,
    },
  });

  await prisma.orderProduct.create({
    data: {
      itemId: mouse.id,
      orderId: adminOrder.id,
      categoryId: electronics.id,
    },
  });

  await prisma.orderProduct.create({
    data: {
      itemId: tshirt.id,
      orderId: userOrder.id,
      categoryId: clothing.id,
    },
  });

  await prisma.orderProduct.create({
    data: {
      itemId: book.id,
      orderId: userOrder.id,
      categoryId: books.id,
    },
  });

  console.log('Seed completed successfully!');
} catch (error) {
  console.error('Seed failed:', error);
} finally {
  await prisma.$disconnect();
}

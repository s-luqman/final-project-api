import prisma from '../config/db.js';

export async function getAll({ search, sortBy, order, offset, limit }) {
  const conditions = {};
  if (search) {
    conditions.OR = [
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  const products = await prisma.product.findMany({
    where: conditions,
    orderBy: { [sortBy]: order },
    take: limit,
    skip: offset,
    include: { category: true },
  });
  return products;
}

export async function getById(id) {
  const product = await prisma.product.findUnique({ where: { id } });
  return product;
}

export async function create(productData) {
  try {
    const newProduct = await prisma.product.create({ data: productData });
    return newProduct;
  } catch (error) {
    if (error.code === 'P2002') {
      const err = new Error('Product name has already been used');
      err.status = 409;
      throw err;
    }
    throw error;
  }
}

export async function update(id, data) {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    });
    return updatedProduct;
  } catch (error) {
    if (error.code === 'P2025') return null;
    if (error.code === 'P2002') {
      const err = new Error('Product name has already been used');
      err.status = 409;
      throw err;
    }
    throw error;
  }
}

export async function remove(id) {
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });
    return deletedProduct;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

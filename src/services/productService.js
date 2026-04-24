import { getAll, getById, create, update, remove } from "../repositories/productRepo.js";

export async function getAllProducts(options) {
    return getAll(options);
}

export async function getProductById(id) {
    const product = await getById(id);
    if (product) return product;
    else {
    const error = new Error(`Post ${id} not found`);
    error.status = 404;
    throw error;
    }
}

export async function createProduct(productData) {
    return create(productData);
}

export async function updateProduct(id, productData) {
    const updatedProduct = await update(id, productData);
  if (updatedProduct) return updatedProduct;
  else {
    const error = new Error(`Product ${id} not found`);
    error.status = 404;
    throw error;
  }
}

export async function deleteProduct(id) {
    const result = await remove(id);
  if (result) return;
  else {
    const error = new Error(`Product ${id} not found`);
    error.status = 404;
    throw error;
  }
}



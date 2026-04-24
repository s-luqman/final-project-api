import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../services/productService.js";

export async function getAllProductsHandler(req, res) {
    const {
        search = '',
        sortBy = 'id',
        order = 'asc',
        offset = 0,
        limit = 5,
    } = req.query;

    const options = {
        search,
        sortBy,
        order,
        offset: parseInt(offset),
        limit: parseInt(limit),
    };

    let products = await getAllProducts(options);
    res.status(200).json(products);
}

export async function getProductByIdHandler(req, res) {
    const id = parseInt(req.params.id);
    const product = await getProductById(id);
    res.status(200).json(product);
}

export async function createProductHandler(req, res) {
    const { name, price, categoryId } = req.body;
    const newProduct = await createProduct({ name, price, categoryId });
    res.status(201).json(newProduct);
}

export async function updateProductHandler(req, res) {
    const id = parseInt(req.params.id);
    const { name, price, categoryId } = req.body;
    const updatedProduct = await updateProduct(id, { name, price, categoryId });
    res.status(200).json(updatedProduct);
}

export async function deleteProductHandler(req, res) {
  const id = parseInt(req.params.id);
  await deleteProduct(id);
  res.status(204).send();
}
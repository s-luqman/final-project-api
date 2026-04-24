import express from 'express';
import { getAllProductsHandler, getProductByIdHandler, createProductHandler, updateProductHandler, deleteProductHandler } from '../controllers/productController.js';
import { validateId, validateCreateProduct, validateUpdateProduct, validateDeleteProduct, validateProductQuery, } from '../middleware/productValidator.js';
import { handleValidationErrors } from '../middleware/handleValidationErrors.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
const router = express.Router();

router.get('/', validateProductQuery, getAllProductsHandler);
router.get('/:id', validateId, getProductByIdHandler);
router.post('/', authenticate, authorizeRoles('ADMIN'), validateCreateProduct, handleValidationErrors, createProductHandler);
router.put('/:id', authenticate, authorizeRoles('ADMIN'), validateId, validateUpdateProduct, handleValidationErrors, updateProductHandler);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), validateDeleteProduct, handleValidationErrors, deleteProductHandler);

export default router;
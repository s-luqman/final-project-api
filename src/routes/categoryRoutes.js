import express from 'express';
import {
	getAllCategoriesHandler,
	getCategoryByIdHandler,
	createCategoryHandler,
	updateCategoryHandler,
	deleteCategoryHandler,
} from '../controllers/categoryController.js';
import {
	validateCategoryId,
	validateCreateCategory,
	validateUpdateCategory,
	validateDeleteCategory,
	validateCategoryQuery,
} from '../middleware/categoryValidator.js';
import { handleValidationErrors } from '../middleware/handleValidationErrors.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = express.Router();

router.get('/', validateCategoryQuery, getAllCategoriesHandler);
router.get('/:id', validateCategoryId, getCategoryByIdHandler);
router.post(
	'/',
	authenticate,
	authorizeRoles('ADMIN'),
	validateCreateCategory,
	handleValidationErrors,
	createCategoryHandler,
);
router.put(
	'/:id',
	authenticate,
	authorizeRoles('ADMIN'),
	validateCategoryId,
	validateUpdateCategory,
	handleValidationErrors,
	updateCategoryHandler,
);
router.delete(
	'/:id',
	authenticate,
	authorizeRoles('ADMIN'),
	validateDeleteCategory,
	handleValidationErrors,
	deleteCategoryHandler,
);

export default router;

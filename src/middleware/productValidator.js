import { param, body, oneOf, query } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateId = [
  param('id')
    .trim()
    .escape()
    .isInt({ min: 1 })
    .withMessage('Id must be a positive integer'),

  handleValidationErrors,
];

export const validateCreateProduct = [
  body('name')
    .exists({ values: 'falsy' })
    .withMessage('Name is required')
    .bail()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),

  body('price')
    .exists({ values: 'falsy' })
    .withMessage('Price is required')
    .bail()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number')
    .bail()
    .matches(/^\d{1,8}(\.\d{1,2})?$/)
    .withMessage('Price must have up to 8 digits and up to 2 decimal places'),

  body('categoryId')
    .exists({ values: 'falsy' })
    .withMessage('Category id is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Category id must be a positive integer'),

  handleValidationErrors,
];

export const validateUpdateProduct = [
  oneOf(
    [
      body('name').exists(),
      body('price').exists(),
      body('categoryId').exists(),
    ],
    { message: 'At least one field (name, price, categoryId) is required' },
  ),

  body('name')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number')
    .bail()
    .matches(/^\d{1,8}(\.\d{1,2})?$/)
    .withMessage('Price must have up to 8 digits and up to 2 decimal places'),

  body('categoryId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category id must be a positive integer'),

  handleValidationErrors,
];

export const validateDeleteProduct = [
  param('id')
    .trim()
    .escape()
    .isInt({ min: 1 })
    .withMessage('Id must be a positive integer'),

  handleValidationErrors,
];

export const validateProductQuery = [
  query('search')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage('search must be at most 100 characters long'),

  query('sortBy')
    .optional()
    .isIn(['id', 'name', 'price', 'categoryId'])
    .withMessage('sortBy must be one of id, name, price, categoryId'),

  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('order must be either asc or desc'),

  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('offset must be a non-negative integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('limit must be an integer between 1 and 50'),

  handleValidationErrors,
];
import { param, body, oneOf, query } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateCategoryId = [
  param('id')
    .trim()
    .escape()
    .isInt({ min: 1 })
    .withMessage('Id must be a positive integer'),

  handleValidationErrors,
];

export const validateCreateCategory = [
  body('name')
    .exists({ values: 'falsy' })
    .withMessage('Name is required')
    .bail()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),

  handleValidationErrors,
];

export const validateUpdateCategory = [
  oneOf([body('name').exists()], {
    message: 'At least one field (name) is required',
  }),

  body('name')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),

  handleValidationErrors,
];

export const validateDeleteCategory = [
  param('id')
    .trim()
    .escape()
    .isInt({ min: 1 })
    .withMessage('Id must be a positive integer'),

  handleValidationErrors,
];

export const validateCategoryQuery = [
  query('search')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage('search must be at most 100 characters long'),

  query('sortBy')
    .optional()
    .isIn(['id', 'name'])
    .withMessage('sortBy must be one of id, name'),

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

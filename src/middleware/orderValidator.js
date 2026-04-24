import { body, param, query } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateOrderId = [
  param('id')
    .trim()
    .escape()
    .isInt({ min: 1 })
    .withMessage('Id must be a positive integer'),

  handleValidationErrors,
];

const itemIdsValidator = body('itemIds')
  .isArray({ min: 1 })
  .withMessage('itemIds must be a non-empty array')
  .bail()
  .custom((itemIds) => itemIds.every((id) => Number.isInteger(id) && id > 0))
  .withMessage('itemIds must contain only positive integers');

export const validateCreateOrder = [itemIdsValidator, handleValidationErrors];

export const validateUpdateOrder = [itemIdsValidator, handleValidationErrors];

export const validateOrderQuery = [
  query('sortBy')
    .optional()
    .isIn(['id', 'userId'])
    .withMessage('sortBy must be one of id, userId'),

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

  query('userId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('userId must be a positive integer'),

  handleValidationErrors,
];

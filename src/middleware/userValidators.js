import { handleValidationErrors } from './handleValidationErrors.js';
import { body, oneOf, param } from 'express-validator';

export const validateSignUp = [
  body('email')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email is not valid')
    .bail()
    .normalizeEmail(),

  body('password')
    .exists({ values: 'falsy' })
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 8, max: 64 })
    .withMessage(
      'Password must contain at least 8 characters and at most 64 characters',
    ),

  body('role')
    .optional()
    .isIn(['USER', 'ADMIN'])
    .withMessage('Role must be either USER or ADMIN'),

  handleValidationErrors,
];

export const validateLogIn = [
  body('email')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Email is required')
    .bail()
    .normalizeEmail(),

  body('password')
    .exists({ values: 'falsy' })
    .withMessage('Password is required'),

  handleValidationErrors,
];

export const validateUserId = [
  param('id')
    .trim()
    .escape()
    .isInt({ min: 1 })
    .withMessage('Id must be a positive integer'),

  handleValidationErrors,
];

export const validateUpdateUser = [
  oneOf(
    [body('name').exists(), body('email').exists(), body('role').exists()],
    { message: 'At least one field (name, email, role) is required' },
  ),

  body('name')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email is not valid')
    .bail()
    .normalizeEmail(),

  body('role')
    .optional()
    .isIn(['USER', 'ADMIN'])
    .withMessage('Role must be either USER or ADMIN'),

  handleValidationErrors,
];

import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { validateUserId, validateUpdateUser } from '../middleware/userValidators.js';
import {
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
} from '../controllers/userController.js';

const router = express.Router();

function setCurrentUserIdParam(req, res, next) {
  req.params.id = String(req.user.id);
  return next();
}

router.use(authenticate);

router.get('/', authorizeRoles('ADMIN'), getAllUsersHandler);
router.get('/me', setCurrentUserIdParam, getUserByIdHandler);
router.put('/me', setCurrentUserIdParam, validateUpdateUser, updateUserHandler);
router.get('/:id', validateUserId, authorizeRoles('ADMIN'), getUserByIdHandler);
router.put('/:id', validateUserId, validateUpdateUser, authorizeRoles('ADMIN'), updateUserHandler);
router.delete('/:id', validateUserId, authorizeRoles('ADMIN'), deleteUserHandler);

export default router;

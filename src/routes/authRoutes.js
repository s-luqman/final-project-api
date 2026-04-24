import express from 'express';
import { validateLogIn, validateSignUp } from '../middleware/userValidators.js';
import { signUpHandler, logInHandler } from '../controllers/authController.js';
import { handleValidationErrors } from '../middleware/handleValidationErrors.js';
import { logInLimiter } from '../middleware/rateLimiter.js';
const router = express.Router()

router.post('/signup', validateSignUp, handleValidationErrors, signUpHandler);
router.post('/login', validateLogIn, handleValidationErrors, logInLimiter, logInHandler);

export default router;
import express from 'express';
import {
	getAllOrdersHandler,
	getOrderByIdHandler,
	createOrderHandler,
	updateOrderHandler,
	deleteOrderHandler,
} from '../controllers/orderController.js';
import {
	validateOrderId,
	validateCreateOrder,
	validateUpdateOrder,
	validateOrderQuery,
} from '../middleware/orderValidator.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/', validateOrderQuery, getAllOrdersHandler);
router.get('/:id', validateOrderId, getOrderByIdHandler);
router.post('/', validateCreateOrder, createOrderHandler);
router.put('/:id', validateOrderId, validateUpdateOrder, updateOrderHandler);
router.delete('/:id', validateOrderId, deleteOrderHandler);

export default router;

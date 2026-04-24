import {
	getAllOrders,
	getOrderById,
	createOrder,
	updateOrder,
	deleteOrder,
} from '../services/orderService.js';

export async function getAllOrdersHandler(req, res) {
	const {
		sortBy = 'id',
		order = 'asc',
		offset = 0,
		limit = 10,
		userId,
	} = req.query;

	const options = {
		sortBy,
		order,
		offset: parseInt(offset),
		limit: parseInt(limit),
		userId: userId ? parseInt(userId) : undefined,
	};

	const orders = await getAllOrders(options, req.user);
	res.status(200).json(orders);
}

export async function getOrderByIdHandler(req, res) {
	const id = parseInt(req.params.id);
	const orderData = await getOrderById(id, req.user);
	res.status(200).json(orderData);
}

export async function createOrderHandler(req, res) {
	const { itemIds } = req.body;
	const newOrder = await createOrder({ itemIds }, req.user);
	res.status(201).json(newOrder);
}

export async function updateOrderHandler(req, res) {
	const id = parseInt(req.params.id);
	const { itemIds } = req.body;
	const updatedOrder = await updateOrder(id, { itemIds }, req.user);
	res.status(200).json(updatedOrder);
}

export async function deleteOrderHandler(req, res) {
	const id = parseInt(req.params.id);
	await deleteOrder(id, req.user);
	res.status(204).send();
}

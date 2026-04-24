import { getAll, getById, create, update, remove } from '../repositories/orderRepo.js';

function ensureOrderAccess(order, requestingUser) {
	const isOwner = order.userId === requestingUser.id;
	const isAdmin = requestingUser.role === 'ADMIN';

	if (!isOwner && !isAdmin) {
		const error = new Error('Forbidden: insufficient permission');
		error.status = 403;
		throw error;
	}
}

export async function getAllOrders(options, requestingUser) {
	const safeOptions = { ...options };
	if (requestingUser.role !== 'ADMIN') {
		safeOptions.userId = requestingUser.id;
	}
	return getAll(safeOptions);
}

export async function getOrderById(id, requestingUser) {
	const order = await getById(id);
	if (!order) {
		const error = new Error(`Order ${id} not found`);
		error.status = 404;
		throw error;
	}

	ensureOrderAccess(order, requestingUser);
	return order;
}

export async function createOrder(orderData, requestingUser) {
	const { itemIds } = orderData;
	const uniqueItemIds = [...new Set(itemIds)];
	if (uniqueItemIds.length !== itemIds.length) {
		const error = new Error('itemIds must be unique');
		error.status = 400;
		throw error;
	}

	return create({ userId: requestingUser.id, itemIds: uniqueItemIds });
}

export async function updateOrder(id, orderData, requestingUser) {
	const existingOrder = await getById(id);
	if (!existingOrder) {
		const error = new Error(`Order ${id} not found`);
		error.status = 404;
		throw error;
	}

	ensureOrderAccess(existingOrder, requestingUser);

	const uniqueItemIds = [...new Set(orderData.itemIds)];
	if (uniqueItemIds.length !== orderData.itemIds.length) {
		const error = new Error('itemIds must be unique');
		error.status = 400;
		throw error;
	}

	const updatedOrder = await update(id, { itemIds: uniqueItemIds });
	if (updatedOrder) return updatedOrder;

	const error = new Error(`Order ${id} not found`);
	error.status = 404;
	throw error;
}

export async function deleteOrder(id, requestingUser) {
	const existingOrder = await getById(id);
	if (!existingOrder) {
		const error = new Error(`Order ${id} not found`);
		error.status = 404;
		throw error;
	}

	ensureOrderAccess(existingOrder, requestingUser);

	const result = await remove(id);
	if (result) return;

	const error = new Error(`Order ${id} not found`);
	error.status = 404;
	throw error;
}

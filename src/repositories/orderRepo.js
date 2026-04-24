import prisma from '../config/db.js';

export async function getAll({ userId, sortBy, order, offset, limit }) {
	const conditions = {};
	if (userId) {
		conditions.userId = userId;
	}

	const orders = await prisma.order.findMany({
		where: conditions,
		orderBy: { [sortBy]: order },
		take: limit,
		skip: offset,
		include: {
			user: { omit: { password: true } },
			orderItems: {
				include: {
					item: true,
					category: true,
				},
			},
		},
	});

	return orders;
}

export async function getById(id) {
	const order = await prisma.order.findUnique({
		where: { id },
		include: {
			user: { omit: { password: true } },
			orderItems: {
				include: {
					item: true,
					category: true,
				},
			},
		},
	});
	return order;
}

async function getProductsByIds(tx, itemIds) {
	const products = await tx.product.findMany({
		where: { id: { in: itemIds } },
		select: { id: true, categoryId: true },
	});
	return products;
}

export async function create(orderData) {
	const { userId, itemIds } = orderData;

	return prisma.$transaction(async (tx) => {
		const products = await getProductsByIds(tx, itemIds);

		if (products.length !== itemIds.length) {
			const error = new Error('One or more products do not exist');
			error.status = 400;
			throw error;
		}

		const newOrder = await tx.order.create({
			data: { userId },
		});

		await tx.orderProduct.createMany({
			data: products.map((product) => ({
				itemId: product.id,
				orderId: newOrder.id,
				categoryId: product.categoryId,
			})),
		});

		return tx.order.findUnique({
			where: { id: newOrder.id },
			include: {
				user: { omit: { password: true } },
				orderItems: {
					include: {
						item: true,
						category: true,
					},
				},
			},
		});
	});
}

export async function update(id, data) {
	const { itemIds } = data;

	return prisma.$transaction(async (tx) => {
		try {
			await tx.order.findUniqueOrThrow({ where: { id } });
		} catch (error) {
			if (error.code === 'P2025') return null;
			throw error;
		}

		const products = await getProductsByIds(tx, itemIds);
		if (products.length !== itemIds.length) {
			const error = new Error('One or more products do not exist');
			error.status = 400;
			throw error;
		}

		await tx.orderProduct.deleteMany({
			where: { orderId: id },
		});

		await tx.orderProduct.createMany({
			data: products.map((product) => ({
				itemId: product.id,
				orderId: id,
				categoryId: product.categoryId,
			})),
		});

		return tx.order.findUnique({
			where: { id },
			include: {
				user: { omit: { password: true } },
				orderItems: {
					include: {
						item: true,
						category: true,
					},
				},
			},
		});
	});
}

export async function remove(id) {
	try {
		const deletedOrder = await prisma.order.delete({ where: { id } });
		return deletedOrder;
	} catch (error) {
		if (error.code === 'P2025') return null;
		throw error;
	}
}
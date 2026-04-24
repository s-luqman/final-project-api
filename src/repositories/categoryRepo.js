import prisma from '../config/db.js';

export async function getAll({ search, sortBy, order, offset, limit }) {
	const conditions = {};
	if (search) {
		conditions.OR = [{ name: { contains: search, mode: 'insensitive' } }];
	}

	const categories = await prisma.category.findMany({
		where: conditions,
		orderBy: { [sortBy]: order },
		take: limit,
		skip: offset,
		include: { items: true },
	});

	return categories;
}

export async function getById(id) {
	const category = await prisma.category.findUnique({
		where: { id },
		include: { items: true },
	});
	return category;
}

export async function create(categoryData) {
	try {
		const newCategory = await prisma.category.create({ data: categoryData });
		return newCategory;
	} catch (error) {
		if (error.code === 'P2002') {
			const err = new Error('Category name has already been used');
			err.status = 409;
			throw err;
		}
		throw error;
	}
}

export async function update(id, data) {
	try {
		const updatedCategory = await prisma.category.update({
			where: { id },
			data,
		});
		return updatedCategory;
	} catch (error) {
		if (error.code === 'P2025') return null;
		if (error.code === 'P2002') {
			const err = new Error('Category name has already been used');
			err.status = 409;
			throw err;
		}
		throw error;
	}
}

export async function remove(id) {
	try {
		const deletedCategory = await prisma.category.delete({
			where: { id },
		});
		return deletedCategory;
	} catch (error) {
		if (error.code === 'P2025') return null;
		throw error;
	}
}
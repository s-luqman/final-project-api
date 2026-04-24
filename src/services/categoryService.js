import { getAll, getById, create, update, remove } from '../repositories/categoryRepo.js';

export async function getAllCategories(options) {
	return getAll(options);
}

export async function getCategoryById(id) {
	const category = await getById(id);
	if (category) return category;

	const error = new Error(`Category ${id} not found`);
	error.status = 404;
	throw error;
}

export async function createCategory(categoryData) {
	return create(categoryData);
}

export async function updateCategory(id, categoryData) {
	const updatedCategory = await update(id, categoryData);
	if (updatedCategory) return updatedCategory;

	const error = new Error(`Category ${id} not found`);
	error.status = 404;
	throw error;
}

export async function deleteCategory(id) {
	const result = await remove(id);
	if (result) return;

	const error = new Error(`Category ${id} not found`);
	error.status = 404;
	throw error;
}

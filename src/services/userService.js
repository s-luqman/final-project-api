import {
	findAllUsers,
	findUserById,
	updateUser,
	deleteUser,
} from '../repositories/userRepo.js';

export async function getAllUsers() {
	return findAllUsers();
}

export async function getUserById(id) {
	const user = await findUserById(id);
	if (user) return user;

	const error = new Error(`User ${id} not found`);
	error.status = 404;
	throw error;
}

export async function updateUserById(id, data) {
	try {
		return await updateUser(id, data);
	} catch (error) {
		if (error.code === 'P2025') {
			const err = new Error(`User ${id} not found`);
			err.status = 404;
			throw err;
		}
		throw error;
	}
}

export async function deleteUserById(id) {
	const deletedUser = await deleteUser(id);
	if (deletedUser) return;

	const error = new Error(`User ${id} not found`);
	error.status = 404;
	throw error;
}

import {
	getAllUsers,
	getUserById,
	updateUserById,
	deleteUserById,
} from '../services/userService.js';

export async function getAllUsersHandler(req, res) {
	const users = await getAllUsers();
	res.status(200).json(users);
}

export async function getUserByIdHandler(req, res) {
	const id = parseInt(req.params.id);
	const user = await getUserById(id);
	res.status(200).json(user);
}

export async function updateUserHandler(req, res) {
	const id = parseInt(req.params.id);
	const { name, email, role } = req.body;
	const updatedUser = await updateUserById(id, { name, email, role });
	res.status(200).json(updatedUser);
}

export async function deleteUserHandler(req, res) {
	const id = parseInt(req.params.id);
	await deleteUserById(id);
	res.status(204).send();
}

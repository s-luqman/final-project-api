import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../repositories/userRepo.js';

export async function signUp({ name, email, password, role }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const fallbackName = (email?.split('@')[0] || 'User').trim();
  const normalizedName = (name || fallbackName).trim();
  const newUser = await createUser({
    name: normalizedName,
    email,
    password: hashedPassword,
    ...(role ? { role } : {}),
  });
  return newUser;
}

export async function logIn(email, password) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
  const error = new Error('Invalid credentials');
  error.status = 401;
  const user = await findUserByEmail(email);
  if (!user) throw error;

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw error;

  const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return accessToken;
}
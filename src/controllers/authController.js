import { signUp, logIn } from "../services/authService.js";

export async function signUpHandler(req, res) {
  const { name, email, password, role } = req.body;
  const newUser = await signUp({ name, email, password, role });
  res.status(201).json(newUser);
}

export async function logInHandler(req, res) {
  const { email, password } = req.body;
  const accessToken = await logIn(email, password);
  res.status(200).json({ accessToken });
}
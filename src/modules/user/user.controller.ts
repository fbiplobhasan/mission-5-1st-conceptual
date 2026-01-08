import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { prisma } from "../../lib/prisma";

const register: RequestHandler = async (req, res) => {
  const payload = req.body;

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await prisma.user.create({
    data: { ...payload, password: hashedPassword },
  });
  res.send({ message: "Registered successfully.", data: user });
};

const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).send({ message: "User not found." });

  const matchPass = await bcrypt.compare(password, user.password);
  if (!matchPass) return res.status(401).send({ message: "Invalid password" });

  // ✅ Use environment variable for secret
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  res.send({ message: "Logged in successfully.", token });
};

export const userController = {
  register,
  login,
};

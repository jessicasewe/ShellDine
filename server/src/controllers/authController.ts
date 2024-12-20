import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      role,
    });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

//login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const isMatch = await user.comparePassword(password);
    console.log("Input Password:", password);
    console.log("Stored Password:", user.password);
    console.log("Password Match:", isMatch);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET is not defined." });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "2h" });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

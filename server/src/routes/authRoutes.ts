import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/register", registerUser as any);
router.post("/login", loginUser as any);

export default router;

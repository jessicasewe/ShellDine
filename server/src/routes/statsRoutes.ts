import express from "express";
import { getDashboardStats } from "../controllers/statsController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Route for dashboard statistics
router.get("/", protect as any, getDashboardStats);

export default router;

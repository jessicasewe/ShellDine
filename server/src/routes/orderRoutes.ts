import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController";
import { isAdmin } from "../middleware/adminMiddleware";

const router = express.Router();

//routes
router.post("/", createOrder as any);
router.get("/", getOrders);
router.put("/:orderId", isAdmin as any, updateOrderStatus as any);

export default router;

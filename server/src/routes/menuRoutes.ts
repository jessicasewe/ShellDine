import express from "express";
import { createMenuItem, getMenuItems } from "../controllers/menuController";
import { isAdmin } from "../middleware/adminMiddleware";

const router = express.Router();

//routes for menu items
router.post("/", isAdmin as any, createMenuItem as any);
router.get("/", getMenuItems);

export default router;

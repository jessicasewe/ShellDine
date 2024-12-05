import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import MenuRoutes from "./routes/menuRoutes";
import OrderRoutes from "./routes/orderRoutes";
import AuthRoutes from "./routes/authRoutes";
import StatsRoutes from "./routes/statsRoutes";
import { protect } from "./middleware/authMiddleware";

dotenv.config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//test routes
app.use("/api/menu", MenuRoutes);
app.use("/api/orders", protect as any, OrderRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/stats", protect as any, StatsRoutes);

export default app;

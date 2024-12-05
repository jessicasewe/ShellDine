import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "Not authorized to access this route" });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.body.userId = decoded.id;

    //fecth user from db
    const user = await User.findById(decoded.id);
    if (user?.role !== "admin") {
      return res
        .status(401)
        .json({ error: "Not authorized to access this route" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Failed to authenticate." });
  }
};

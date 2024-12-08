import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ error: "Not authorized to access this route" });
  }

  try {
    console.log("JWT_SECRET in middleware:", JWT_SECRET); // Check the value
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined.");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in protect middleware:", error.message);
    } else {
      console.error("Error in protect middleware:", error);
    }
    res.status(401).json({ error: "Unauthorized: Invalid token." });
  }
};

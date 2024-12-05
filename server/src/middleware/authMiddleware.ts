import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ error: "Not authorized to access this route" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token." });
  }
};

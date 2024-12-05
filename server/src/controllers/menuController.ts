import { Request, Response } from "express";
import MenuItem from "../models/MenuItem";

// Add a new menu item
export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const { name, price, description, emoji } = req.body;

    if (!name || !price || !description || !emoji) {
      return res.status(400).json({
        error: "All fields are required.",
      });
    }

    const menuItem = await MenuItem.create({ name, price, description, emoji });
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//get all menu items
export const getMenuItems = async (req: Request, res: Response) => {
  try {
    const menu = await MenuItem.find();
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

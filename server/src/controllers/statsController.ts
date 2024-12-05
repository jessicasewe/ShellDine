import { Request, Response } from "express";
import Order from "../models/Order";
import MenuItem from "../models/MenuItem";

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // 1. Total Orders
    const totalOrders = await Order.countDocuments();

    // 2. Orders by Status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // 3. Total Revenue from completed orders
    const totalRevenue = await Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);

    // 4. Menu Item Popularity
    const popularMenuItems = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          totalOrders: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "menuitems", // assuming menu items are stored in a collection named "menuitems"
          localField: "_id",
          foreignField: "_id",
          as: "menuItem",
        },
      },
      { $unwind: "$menuItem" },
      {
        $project: {
          menuItemName: "$menuItem.name",
          totalOrders: 1,
        },
      },
    ]);

    // Combine all statistics
    const stats = {
      totalOrders,
      ordersByStatus,
      totalRevenue: totalRevenue[0]?.totalRevenue || 0,
      popularMenuItems,
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

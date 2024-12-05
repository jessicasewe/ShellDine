import { Request, Response } from "express";
import Order from "../models/Order";

// create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerName, items, total } = req.body;

    if (!customerName || !items || !total) {
      return res.status(400).json({
        error: "All fields (customerName, items, total) are required.",
      });
    }

    const order = await Order.create({ customerName, items, total });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//get all orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate("items.menuItem");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body; // New status (e.g., "completed", "canceled")

  // Check if status is provided and is a valid status
  if (!status || !["pending", "completed", "canceled"].includes(status)) {
    return res
      .status(400)
      .json({
        error:
          'Invalid order status. It must be one of: "pending", "completed", "canceled".',
      });
  }

  try {
    // Find the order by ID and update its status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status }, // Update the order's status
      { new: true } // Return the updated document
    );

    // If order not found
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Return updated order
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

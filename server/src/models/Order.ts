import mongoose from "mongoose";

const OderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  status: { type: String, required: true, default: "pending" },
  created: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OderSchema);

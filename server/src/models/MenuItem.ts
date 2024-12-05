import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  emoji: { type: String, required: true },
});

export default mongoose.models.MenuItem ||
  mongoose.model("MenuItem", MenuItemSchema);

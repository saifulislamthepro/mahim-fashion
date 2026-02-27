import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  items: [
    {
      productId: String,
      title: String,
      size: String,
      qty: Number,
      price: Number,
      image: String,
      total: Number,
    },
  ],

  subtotal: Number,
  shippingCost: Number,
  total: Number,
  shippingZone: String,

  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  city: String,
  state: String,
  postcode: String,
  address: String,
  notes: String,
  userId: String,
  paymentMethod: String,
  tran_id: String,
  validationData: Object,
  status: { type: String, default: "pending" },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);

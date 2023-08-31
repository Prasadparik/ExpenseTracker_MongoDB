const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  paymentid: { type: String },
  orderid: { type: String },
  status: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

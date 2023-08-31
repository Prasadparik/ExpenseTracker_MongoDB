const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  amount: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  userName: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;

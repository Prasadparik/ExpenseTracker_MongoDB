const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true, unique: true },
  userPassword: { type: String, required: true },
  totalExpense: { type: Number },
  ispremiumuser: { type: Boolean },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

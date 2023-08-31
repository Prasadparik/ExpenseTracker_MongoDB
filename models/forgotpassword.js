const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.UUID, required: true },
  active: { type: Boolean },
  expiresBy: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Forgotpassword = mongoose.model("Forgotpassword", forgotPasswordSchema);

module.exports = Forgotpassword;

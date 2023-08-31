// Imports -------------------------------------------
const express = require("express");
const route = express.Router();

const {
  purchasePremium,
  updateTransactionStatus,
} = require("../controllers/purchase");
const { Authenticate, AuthAddExpense } = require("../middleware/auth");

// User Routes -----------------------------------------

route.get("/purchase", Authenticate, purchasePremium);
route.post(
  "/purchase/updateTransactionStatus",
  Authenticate,
  updateTransactionStatus
);

module.exports = route;

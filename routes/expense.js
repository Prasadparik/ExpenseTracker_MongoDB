// Imports -------------------------------------------
const express = require("express");
const route = express.Router();

const {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpense,
} = require("../controllers/expense");
const { Authenticate, AuthAddExpense } = require("../middleware/auth");

// User Routes -----------------------------------------

route.post("/", AuthAddExpense, addExpense);
route.get("/", Authenticate, getAllExpense);
route.delete("/:id", Authenticate, deleteExpense);
route.get("/download", Authenticate, downloadExpense);

module.exports = route;

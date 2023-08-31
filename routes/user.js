// Imports -------------------------------------------
const express = require("express");
const route = express.Router();

const { addUser, logInUser } = require("../controllers/user");

// User Routes -----------------------------------------

route.post("/signup", addUser);
route.post("/login", logInUser);

module.exports = route;

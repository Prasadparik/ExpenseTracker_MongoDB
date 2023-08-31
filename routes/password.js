const express = require("express");
const route = express.Router();

const {
  forgotpassword,
  resetpassword,
  updatepassword,
} = require("../controllers/password");
const { Authenticate } = require("../middleware/auth");

// ROUTES ----------------------------

route.use("/forgotpassword", forgotpassword);

route.get("/resetpassword/:id", resetpassword);

route.get("/updatepassword/:id", updatepassword);

module.exports = route;

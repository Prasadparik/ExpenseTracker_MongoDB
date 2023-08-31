// Imports -------------------------------------------
const express = require("express");
const route = express.Router();

const {
  getUserLeaderBoard,
  getUserDownload,
} = require("../controllers/premium");
const { Authenticate } = require("../middleware/auth");

// User Routes -----------------------------------------

route.get("/leaderboard", Authenticate, getUserLeaderBoard);
route.get("/downloadhistory", Authenticate, getUserDownload);

module.exports = route;

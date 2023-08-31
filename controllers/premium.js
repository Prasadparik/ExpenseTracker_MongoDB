const User = require("../models/User");
const Expense = require("../models/expense");
const ReportDownload = require("../models/reportDownload");

const getUserLeaderBoard = async (req, res) => {
  try {
    const leaderboardUsers = await User.find();

    res.status(200).json(leaderboardUsers);
  } catch (error) {
    res.status(500).json({ message: "Leaderboard error!" });
  }
};

const getUserDownload = async (req, res) => {
  try {
    const usersDownload = await ReportDownload.find({ user: req.user._id });

    res.status(200).json(usersDownload);
  } catch (error) {
    res.status(500).json({ message: "Download history error!" });
  }
};

module.exports = {
  getUserLeaderBoard,
  getUserDownload,
};

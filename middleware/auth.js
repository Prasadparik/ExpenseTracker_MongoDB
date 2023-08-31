const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming you have the User model defined

const Authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const filter = req.header("filter");
    const userToken = jwt.verify(token, "secretkey");
    const findUser = await User.findById(userToken.userId);
    req.user = findUser;
    req.token = userToken;
    req.filter = filter;
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
  next();
};

const AuthAddExpense = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const userToken = jwt.verify(token, "secretkey");
    console.log("AUTH MID >>>>>>>>", userToken);
    const findUser = await User.findById(userToken.userId);
    req.user = findUser;
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
  next();
};

module.exports = {
  Authenticate,
  AuthAddExpense,
};

const User = require("../models/User"); // Assuming you have the User model defined
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ==========================================================

function generateAccessToken(obj) {
  console.log("GEN JWT >>>>>>>>>>>", obj);
  return jwt.sign(obj, "secretkey");
}

// ==========================================================

const addUser = async (req, res) => {
  console.log("BODY::", req.body);

  try {
    const checkUserExists = await User.findOne({
      userEmail: req.body.userEmail,
    });
    if (checkUserExists) {
      return res.status(400).send("User already exists");
    }

    bcrypt.hash(req.body.userPassword, 10, async (err, hash) => {
      if (err) {
        console.log("ERROR =>:", err);
        return res.status(500).send("Internal server error");
      }

      const newUser = new User({
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userPassword: hash,
        totalExpense: 0,
        ispremiumuser: 0,
      });

      try {
        await newUser.save();
        return res.sendStatus(200);
      } catch (saveError) {
        console.log("SAVE ERROR =>:", saveError);
        return res.status(500).send("Error saving user");
      }
    });
  } catch (error) {
    console.log("ERROR =>:", error);
    return res.status(500).send("Internal server error");
  }
};

// ==================================================================

const logInUser = async (req, res) => {
  console.log("BODY::", req.body);

  try {
    const result = await User.findOne({ userEmail: req.body.userEmail });

    bcrypt.compare(req.body.userPassword, result.userPassword, (err, check) => {
      if (check) {
        res.status(200).json({
          data: result,
          token: generateAccessToken({
            userId: result._id,
            userName: result.userName,
            ispremiumuser: result.ispremiumuser,
          }),
        });
      } else {
        res.sendStatus(401);
      }
    });
  } catch (error) {
    res.status(404).send("User not found!");
  }
};

module.exports = {
  addUser,
  logInUser,
  generateAccessToken,
};

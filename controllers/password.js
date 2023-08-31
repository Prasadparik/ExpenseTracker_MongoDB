const nodemailer = require("nodemailer");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("../models/User"); // Assuming you have the User model defined
const Forgotpassword = require("../models/forgotpassword"); // Assuming you have the Forgotpassword model defined

// =================================================

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ userEmail: email });

    if (user) {
      const id = uuid.v4();
      await Forgotpassword.create({ _id: id, active: true, user: user._id });

      // SENDING MAIL ---------------
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "prasadparik18@gmail.com",
          pass: "hfavcfyghqjtyyjy",
        },
      });

      const info = await transporter.sendMail({
        from: '"Prasad" <prasadparik18@gmail.com>',
        to: email,
        subject: "Reset Password",
        text: "Click on the buttton to reset Password",
        html: `<a href="http://localhost:3000/api/password/resetpassword/${id}">Reset password</a>`,
      });

      console.log("Message sent: %s", info.messageId);
      res.json(info);
    } else {
      throw new Error("User doesn't exist");
    }
  } catch (err) {
    console.error(err);
    return res.json({ message: err, success: false });
  }
};

const resetpassword = async (req, res) => {
  const id = req.params.id;
  try {
    const forgotpasswordrequest = await Forgotpassword.findOne({ _id: id });
    if (forgotpasswordrequest) {
      await forgotpasswordrequest.updateOne({ active: false });
      res.status(200).send(`<html>
        <form action="/api/password/updatepassword/${id}" method="get">
          <label for="newpassword">Enter New password</label>
          <input name="newpassword" type="password" required></input>
          <button>reset password</button>
        </form>
      </html>`);
    } else {
      res.status(404).send("Invalid reset password request.");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const updatepassword = async (req, res) => {
  try {
    const { newpassword } = req.query;
    const { id } = req.params;
    const resetpasswordrequest = await Forgotpassword.findOne({ _id: id });

    if (resetpasswordrequest) {
      const user = await User.findById(resetpasswordrequest.user);

      if (user) {
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, async (err, salt) => {
          if (err) {
            console.log(err);
            throw new Error(err);
          }

          bcrypt.hash(newpassword, salt, async (err, hash) => {
            if (err) {
              console.log(err);
              throw new Error(err);
            }

            await user.updateOne({ userPassword: hash });
            res.status(201).send("<h1>Password reset successfully!</h1>");
          });
        });
      } else {
        res.status(404).json({ error: "No user exists", success: false });
      }
    } else {
      res.status(404).send("Invalid reset password request.");
    }
  } catch (error) {
    res.status(403).json({ error, success: false });
  }
};

module.exports = {
  forgotpassword,
  updatepassword,
  resetpassword,
};

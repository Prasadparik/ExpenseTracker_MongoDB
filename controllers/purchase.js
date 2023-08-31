const Razorpay = require("razorpay");
const Order = require("../models/order"); // Assuming you have the Order model defined
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ==========================================================

function generateAccessToken(obj) {
  console.log("GEN JWT >>>>>>>>>>>", obj);
  return jwt.sign(obj, "secretkey");
}

// ==========================================================

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const userController = require("./user");

const purchasePremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const amount = 2000;
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }

      console.log("orderId:", order.id);
      try {
        const createdOrder = await Order.create({
          orderid: order.id,
          status: "PENDING",
          user: req.user._id,
        });

        return res
          .status(201)
          .json({ order: createdOrder, key_id: rzp.key_id });
      } catch (err) {
        throw new Error(err);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Something Went Wrong!", error: error });
  }
};

// ------------------------------------------------------------

const updateTransactionStatus = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;
    console.log(` >>>>> REQ BODY :::: ${req.body.payment_id}  || ${order_id}`);
    const order = await Order.findOne({ orderid: order_id });
    console.log(` >>>>> order :::: ${order}`);

    if (order) {
      await order.updateOne({ paymentid: payment_id, status: "SUCCESSFUL" });
      await req.user.updateOne({ ispremiumuser: true });

      return res.status(202).json({
        success: true,
        message: "Transaction Successful",
        token: generateAccessToken({
          userId: req.user._id,
          userName: req.user.userName,
          ispremiumuser: true,
        }),
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Transaction update failed",
      error: error,
    });
  }
};

module.exports = {
  purchasePremium,
  updateTransactionStatus,
};

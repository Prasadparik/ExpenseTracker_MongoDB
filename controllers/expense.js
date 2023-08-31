const Expense = require("../models/expense");
const ReportDownload = require("../models/reportDownload");
const User = require("../models/User");
const AWS = require("aws-sdk");
require("dotenv").config();

const addExpense = async (req, res) => {
  const { amount, category, description } = req.body;

  try {
    const expense = new Expense({
      amount,
      category,
      description,
      userName: req.user.userName,
      user: req.user._id,
    });

    const result = await expense.save();
    console.log();
    // Updating Total Expense
    const totalExpense = Number(req.user.totalExpense) + Number(amount);
    console.log("Total Expense >>>>", totalExpense);

    await User.findByIdAndUpdate(req.user._id, { totalExpense });

    console.log("RESULT =>", result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding expense" });
  }
};

const getAllExpense = async (req, res) => {
  try {
    const filter = req.query.filter || "all"; // Default filter is "all"
    console.log("FILTER BODY ===>", filter);

    const result = await Expense.find({ user: req.user._id });

    let filteredData = result;

    if (filter === "daily") {
      const currentDate = new Date().toISOString().substr(0, 10);
      filteredData = result.filter(
        (expense) =>
          expense.updatedAt.toISOString().substr(0, 10) === currentDate
      );
    } else if (filter === "monthly") {
      const currentMonth = new Date().toISOString().substr(0, 7);
      filteredData = result.filter(
        (expense) =>
          expense.updatedAt.toISOString().substr(0, 7) === currentMonth
      );
    } else if (filter === "yearly") {
      const currentYear = new Date().toISOString().substr(0, 4);
      filteredData = result.filter(
        (expense) =>
          expense.updatedAt.toISOString().substr(0, 4) === currentYear
      );
    }

    let limit = Number(req.query.limit);
    // Pagination logic
    const page = Number(req.query.page) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    res.status(200).json({
      expenseData: paginatedData,
      currentPage: page,
      hasNextPage: endIndex < filteredData.length,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      noOfPages: Math.ceil(filteredData.length / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving expenses" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const deleteExpenseAmount = await Expense.findById(req.params.id);
    console.log("deleteExpenseAmount >>>", Number(deleteExpenseAmount.amount));

    const result = await Expense.findByIdAndDelete(req.params.id);

    // Updating Total Expense
    const totalExpense =
      req.user.totalExpense - Number(deleteExpenseAmount.amount);
    console.log("Total Expense >>>>", totalExpense);

    await User.findByIdAndUpdate(req.user._id, { totalExpense });

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting expense" });
  }
};

// Download ===============================================

function uploadTos3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Something Went Wrong", err);
        reject(err);
      } else {
        // console.log("Success", s3response);
        resolve(s3response.Location);
      }
    });
  });
}

const downloadExpense = async (req, res) => {
  try {
    // const expenses = await req.User.getExpenses();
    const expenses = await Expense.find({ user: req.user._id });
    console.log(" <<<<<<<<<<<<<<< Expense >>>", expenses);

    const stringifyedExpenses = JSON.stringify(expenses);
    const filename = `${req.user._id}-${
      req.user.userName
    }-${new Date()}-Expenses.txt`;
    const fileUrl = await uploadTos3(stringifyedExpenses, filename);
    console.log(" <<<<<<<<<<<<<<< FILE URL >>>", fileUrl);

    // Adding file url to DB
    const response = ReportDownload.create({
      url: fileUrl,
      user: req.user._id,
    });

    res.status(200).json({ fileUrl, success: true });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpense,
};

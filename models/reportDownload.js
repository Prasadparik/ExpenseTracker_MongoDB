const mongoose = require("mongoose");

const reportDownloadSchema = new mongoose.Schema({
  url: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReportDownload = mongoose.model("ReportDownload", reportDownloadSchema);

module.exports = ReportDownload;

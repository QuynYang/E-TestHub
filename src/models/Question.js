const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },
    content: { type: String, required: true },
    options: {
      type: [String],
      validate: (v) => Array.isArray(v) && v.length >= 2 && v.length <= 4,
    },
    correctAnswer: { type: String, enum: ["A", "B", "C", "D"], required: true },
    score: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("Question", questionSchema);

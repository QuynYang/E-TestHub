const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    startYear: { type: Number, required: true },
    endYear: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    password: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true,
      index: true,
    },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    info: { type: Object },
    dateOfBirth: { type: Date },
    avatar: { type: String },
    personalInfo: { type: String },
    teachingSubjects: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  if (doc.role === "student") {
    await mongoose.model("Submission").deleteMany({ studentId: doc._id });
  }
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);

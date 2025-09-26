const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register user (admin can create roles; for demo allow open register if no admin exists)
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, fullName, role, classId, teachingSubjects } =
      req.body;
    if (!username || !password || !fullName || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ message: "Username exists" });
    const user = await User.create({
      username,
      password,
      fullName,
      role,
      classId,
      teachingSubjects,
    });
    return res
      .status(201)
      .json({ _id: user._id, username: user.username, role: user.role });
  } catch (err) {
    next(err);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Missing username/password" });
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    return res.json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

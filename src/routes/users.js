const router = require("express").Router();
const { authenticate } = require("../middlewares/auth");

router.use(authenticate);

router.get("/", async (req, res) => {
  return res.json({ resource: "users", status: "ok" });
});

module.exports = router;

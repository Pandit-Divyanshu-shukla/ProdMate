const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const { generateInsights } = require("../controllers/aiController");

router.get("/insights", auth, generateInsights);

module.exports = router;

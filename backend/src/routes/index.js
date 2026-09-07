// routes/index.js
const express = require("express");
const { sendSuccess } = require("../utils/apiResponse");

const router = express.Router();

router.get("/", (req, res) => {
  sendSuccess(res, { message: "Bookly API v1", data: { status: "ok" } });
});

router.use("/auth", require("./authRoutes"));
router.use("/users", require("./userRoutes"));
router.use("/professionals", require("./professionalRoutes"));
router.use("/appointments", require("./appointmentRoutes"));
router.use("/favorites", require("./favoriteRoutes"));
router.use("/notifications", require("./notificationRoutes"));
router.use("/reviews", require("./reviewRoutes"));
router.use("/services", require("./serviceRoutes"));

module.exports = router;

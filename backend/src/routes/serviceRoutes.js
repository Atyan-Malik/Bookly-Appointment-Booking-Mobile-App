const express = require("express");
const router = express.Router();

const {
  getMyServices,
  createService,
  deleteService,
} = require("../controllers/serviceController");

const {
  getCategories,
} = require("../controllers/categoryController");

const { protect } = require("../middlewares/auth");

// =========================
// SERVICES
// =========================

router.get("/my", protect, getMyServices);

router.post("/", protect, createService);

router.delete("/:id", protect, deleteService);

// =========================
// CATEGORIES
// =========================

router.get("/categories", protect, getCategories);

module.exports = router;
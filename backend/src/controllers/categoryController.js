const Category = require("../models/Category");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    }).sort({ name: 1 });

    return sendSuccess(res, {
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return sendError(res, {
      message: "Failed to fetch categories",
      statusCode: 500,
    });
  }
};

module.exports = {
  getCategories,
};
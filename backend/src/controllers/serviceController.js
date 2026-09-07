const Service = require("../models/Service");
const Professional = require("../models/Professional");
const AppError = require("../utils/AppError");

// Get services belonging to the logged-in provider
async function getMyServices(req, res) {
  try {
    console.log("========== SERVICE DEBUG ==========");
    console.log("REQ.USER:", req.user);
    console.log("USER ID:", req.user?.id);
    console.log("USER ID TYPE:", typeof req.user?.id);

    const professional = await Professional.findOne({
      user: req.user.id,
    }).lean();

    console.log("MATCHED PROFESSIONAL:", professional);
    console.log("===================================");

    if (!professional) {
      return res.status(404).json({
        message: "Professional profile not found",
      });
    }

    const services = await Service.find({
      professional: professional._id,
      isActive: true,
    }).sort({ price: 1 });

    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Get my services error:", error);

    return res.status(500).json({
      message: "Failed to get services",
    });
  }
}


// Create a service for the logged-in provider
async function createService(req, res) {
  try {
    const {
      category,
      name,
      description,
      price,
      durationMinutes,
    } = req.body;

    // Validate required fields
    if (
      !category ||
      !name ||
      price === undefined ||
      durationMinutes === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Category, name, price, and duration are required",
      });
    }

    // Find professional belonging to logged-in user
    const professional = await Professional.findOne({
      user: req.user.id,
    });

    if (!professional) {
      return res.status(404).json({
        success: false,
        message: "Professional profile not found",
      });
    }

    // Verify category exists and is active
    const Category = require("../models/Category");

    const categoryExists = await Category.findOne({
      _id: category,
      isActive: true,
    });

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid or inactive category",
      });
    }

    // Create service
    const service = await Service.create({
      professional: professional._id,
      category: categoryExists._id,
      name: name.trim(),
      description: description?.trim() || "",
      price: Number(price),
      durationMinutes: Number(durationMinutes),
    });

    return res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Create service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create service",
    });
  }
}

// Delete a service belonging to the logged-in provider
async function deleteService(req, res) {
  try {
    const { id } = req.params;

    const professional = await Professional.findOne({
      user: req.user.id,
    });

    if (!professional) {
      return res.status(404).json({
        message: "Professional profile not found",
      });
    }

    const service = await Service.findOne({
      _id: id,
      professional: professional._id,
    });

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    await service.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    return res.status(500).json({
      message: "Failed to delete service",
    });
  }
}


module.exports = {
  getMyServices,
  createService,
  deleteService,
};
const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const upload = require("../middlewares/upload");
const protect = require("../middlewares/authMiddleware");

// GET all categories (public)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE category (admin only)
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;

    // Cloudinary image URL
    const image = req.file ? req.file.path : "";

    const category = new Category({
      name,
      description,
      image,
    });

    await category.save();

    res.status(201).json(category);
  } catch (err) {
    console.error("Category create error:", err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE category (admin only)
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;

    const updateData = {
      name,
      description,
    };

    // New image uploaded to Cloudinary
    if (req.file) {
      updateData.image = req.file.path;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    console.error("Category update error:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE category (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error("Category delete error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
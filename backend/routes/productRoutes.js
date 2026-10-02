const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const upload = require("../middlewares/upload");
const protect = require("../middlewares/authMiddleware");

const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);

// GET all products (public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET products by category (public)
router.get("/category/:categoryName", async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryName,
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE product (admin only)
router.post("/", protect, uploadFields, async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      variants,
      tagline,
      details,
      material,
      processingTime,
      careInstructions,
      shippingInfo,
      subcategory,
    } = req.body;

    // Cloudinary URLs
    const image = req.files?.image?.[0]
      ? req.files.image[0].path
      : "";

    const images = req.files?.images
      ? req.files.images.map((file) => file.path)
      : [];

    const product = new Product({
      name,
      category,
      description,
      image,
      images,
      tagline,
      details,
      material,
      processingTime,
      careInstructions,
      shippingInfo,
      subcategory: subcategory || null,
      variants: JSON.parse(variants),
    });

    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error("Product create error:", err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE product (admin only)
router.put("/:id", protect, uploadFields, async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      variants,
      tagline,
      details,
      material,
      processingTime,
      careInstructions,
      shippingInfo,
      subcategory,
    } = req.body;

    const updateData = {
      name,
      category,
      description,
      variants: JSON.parse(variants),
      tagline,
      details,
      material,
      processingTime,
      careInstructions,
      shippingInfo,
      subcategory: subcategory || null,
    };

    // Main image
    if (req.files?.image?.[0]) {
      updateData.image = req.files.image[0].path;
    }

    // Additional images
    if (req.files?.images?.length > 0) {
      updateData.images = req.files.images.map((file) => file.path);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Product update error:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE product (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const upload = require("../middlewares/upload");
const protect = require("../middlewares/authMiddleware");

const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);

// GET all products (public) - order ke hisaab se
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ order: 1, createdAt: 1 });
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
    }).sort({ order: 1, createdAt: 1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// REORDER products (admin only)
// NOTE: ye "/:id" wale routes se upar hona zaroori hai
router.put("/reorder", protect, async (req, res) => {
  try {
    const { ids } = req.body; // ek category ke products, naye order mein

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids array chahiye" });
    }

    await Product.bulkWrite(
      ids.map((id, index) => ({
        updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
      }))
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Product reorder error:", err);
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
      size,
      subcategory,
      pinFirst,
    } = req.body;

    // Cloudinary URLs
    const image = req.files?.image?.[0]
      ? req.files.image[0].path
      : "";

    const images = req.files?.images
      ? req.files.images.map((file) => file.path)
      : [];

    // Default: category mein sabse last. pinFirst ho to sabse pehle.
    let order = 0;
    if (pinFirst === "true") {
      const first = await Product.findOne({ category }).sort({ order: 1 });
      order = first ? first.order - 1 : 0;
    } else {
      const last = await Product.findOne({ category }).sort({ order: -1 });
      order = last ? last.order + 1 : 0;
    }

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
      size: size ? size.trim() : "",
      subcategory: subcategory || null,
      variants: variants ? JSON.parse(variants) : [],
      order,
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
      size,
      subcategory,
    } = req.body;

    const updateData = {
      name,
      category,
      description,
      tagline,
      details,
      material,
      processingTime,
      careInstructions,
      shippingInfo,
      subcategory: subcategory || null,
    };

    // Size sirf tab update ho jab request me aaye
    // (khali bhejne par size hat jayegi)
    if (size !== undefined) {
      updateData.size = size.trim();
    }

    // Variants sirf tab update ho jab request me aaye
    if (variants) {
      updateData.variants = JSON.parse(variants);
    }

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
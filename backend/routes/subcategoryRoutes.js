const express = require("express");
const router = express.Router();
const Subcategory = require("../models/subcategory");
const Product = require("../models/product");
const upload = require("../middlewares/upload");
const protect = require("../middlewares/authMiddleware");

// GET subcategories (public). Optional: /api/subcategories?category=Varmala Resin
router.get("/", async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const subcategories = await Subcategory.find(filter).sort({ createdAt: 1 });
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE subcategory (admin only)
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { name, category, details, material } = req.body;
    const image = req.file ? req.file.path : "";

    const subcategory = new Subcategory({
      name,
      category,
      image,
      details: details || "",
      material: material || "",
    });
    await subcategory.save();

    res.status(201).json(subcategory);
  } catch (err) {
    console.error("Subcategory create error:", err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE subcategory (admin only)
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const { name, category, details, material } = req.body;
    const updateData = { name, category };

    // details / material sirf tab update ho jab request me aayein
    // (khali bhejne par hat jayenge)
    if (details !== undefined) updateData.details = details;
    if (material !== undefined) updateData.material = material;

    if (req.file) {
      updateData.image = req.file.path;
    }

    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.json(subcategory);
  } catch (err) {
    console.error("Subcategory update error:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE subcategory (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // is subcategory ke products category mein hi rahenge, bas subcategory se link hat jayega
    await Product.updateMany(
      { subcategory: subcategory._id },
      { $set: { subcategory: null } }
    );

    res.json({ message: "Subcategory deleted" });
  } catch (err) {
    console.error("Subcategory delete error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
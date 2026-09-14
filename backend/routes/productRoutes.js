const express = require("express")
const router = express.Router()
const Product = require("../models/product")
const upload = require("../middlewares/upload")

const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 4 },
])

router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get("/category/:categoryName", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryName })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post("/", uploadFields, async (req, res) => {
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
    } = req.body

    const image = req.files?.image?.[0] ? `/uploads/${req.files.image[0].filename}` : ""
    const images = req.files?.images
      ? req.files.images.map((f) => `/uploads/${f.filename}`)
      : []

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
      variants: JSON.parse(variants), // FormData se string aata hai
    })
    await product.save()
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put("/:id", uploadFields, async (req, res) => {
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
    } = req.body

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
    }

    if (req.files?.image?.[0]) {
      updateData.image = `/uploads/${req.files.image[0].filename}`
    }
    if (req.files?.images?.length > 0) {
      updateData.images = req.files.images.map((f) => `/uploads/${f.filename}`)
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: "Product deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
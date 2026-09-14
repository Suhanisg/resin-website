const express = require("express")
const router = express.Router()
const Category = require("../models/category")
const upload = require("../middlewares/upload")

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : ""

    const category = new Category({ name, description, image })
    await category.save()
    res.status(201).json(category)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body
    const updateData = { name, description }
    if (req.file) updateData.image = `/uploads/${req.file.filename}`

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json(category)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: "Category deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
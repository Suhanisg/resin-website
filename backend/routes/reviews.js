const router = require('express').Router()
const Screenshot = require('../models/Screenshot')
const Review = require('../models/Review')
const upload = require('../middlewares/upload')
const protect = require('../middlewares/authMiddleware')

// Screenshots (admin add/delete, sab dekh sakte hain)
router.get('/screenshots', async (req, res) => {
  try {
    res.json(await Screenshot.find().sort({ createdAt: -1 }))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/screenshots', protect, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Photo required' })
    const saved = await Screenshot.create({ photo: req.file.path })
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/screenshots/:id', protect, async (req, res) => {
  try {
    await Screenshot.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Text reviews (customer submit kar sakta hai, delete sirf admin)
router.get('/reviews', async (req, res) => {
  try {
    res.json(await Review.find().sort({ createdAt: -1 }))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/reviews', upload.single('photo'), async (req, res) => {
  try {
    const { name, rating, review } = req.body
    const saved = await Review.create({
      name,
      rating: Number(rating),
      review,
      photo: req.file ? req.file.path : undefined,
    })
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/reviews/:id', protect, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
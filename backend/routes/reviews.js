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

// ---------- Text reviews ----------

// PUBLIC: sirf approved reviews
router.get('/reviews', async (req, res) => {
  try {
    res.json(await Review.find({ status: 'approved' }).sort({ createdAt: -1 }))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ADMIN: saare reviews (optional ?status=pending|approved|rejected)
// NOTE: ye route '/reviews/:id' wale routes se pehle rehna chahiye
router.get('/reviews/admin', protect, async (req, res) => {
  try {
    const filter = {}
    if (['pending', 'approved', 'rejected'].includes(req.query.status)) {
      filter.status = req.query.status
    }
    res.json(await Review.find(filter).sort({ createdAt: -1 }))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// CUSTOMER submit: hamesha pending se start (max 4 photos, field name: "photos")
router.post('/reviews', upload.array('photos', 4), async (req, res) => {
  try {
    const { name, rating, review } = req.body
    const photos = (req.files || []).map((f) => f.path)

    const saved = await Review.create({
      name,
      rating: Number(rating),
      review,
      photos,
      // purane code/admin panel ke liye pehli photo `photo` mein bhi rakhi hai
      photo: photos[0],
      status: 'pending', // body se kabhi status mat lo
    })
    res.status(201).json({
      message: 'Review submitted! It will appear after admin approval.',
      review: saved,
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// ADMIN: approve / reject
router.patch('/reviews/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }
    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    )
    if (!updated) return res.status(404).json({ message: 'Review not found' })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
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
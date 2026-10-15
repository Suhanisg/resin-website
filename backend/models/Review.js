const mongoose = require('mongoose')

module.exports = mongoose.model('Review', new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  photo: String,
  photos: [String],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true }))
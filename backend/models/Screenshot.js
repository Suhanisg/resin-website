const mongoose = require('mongoose')

module.exports = mongoose.model('Screenshot', new mongoose.Schema({
  photo: { type: String, required: true },
}, { timestamps: true }))
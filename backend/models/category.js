const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },

    // Card mein image ki position (admin panel se set hoti hai).
    // Jaan-bujhkar koi default nahi hai: purani categories mein ye fields
    // missing rahengi aur frontend unke liye purani fallback position use karega.
    imageX: { type: Number, min: 0, max: 100 },     // left -> right (%)
    imageY: { type: Number, min: 0, max: 100 },     // top -> bottom (%)
    imageZoom: { type: Number, min: 100, max: 200 }, // zoom (%)
  },
  { timestamps: true }
)

module.exports = mongoose.model("Category", categorySchema)
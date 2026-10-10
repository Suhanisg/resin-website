const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },

    // Is category ke saare products ke popup mein dikhne wale sections
    details: { type: String, default: "" },
    material: { type: String, default: "" },

    imageX: { type: Number, min: 0, max: 100 },     // left -> right (%)
    imageY: { type: Number, min: 0, max: 100 },     // top -> bottom (%)
    imageZoom: { type: Number, min: 20, max: 200 }, // zoom (%), 100 se kam = poori image
  },
  { timestamps: true }
)

module.exports = mongoose.model("Category", categorySchema)
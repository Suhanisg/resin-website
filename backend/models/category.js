const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },


    imageX: { type: Number, min: 0, max: 100 },     // left -> right (%)
    imageY: { type: Number, min: 0, max: 100 },     // top -> bottom (%)
    imageZoom: { type: Number, min: 20, max: 200 }, // zoom (%), 100 se kam = poori image
  },
  { timestamps: true }
)

module.exports = mongoose.model("Category", categorySchema)
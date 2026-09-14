const mongoose = require("mongoose")

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: { type: Number, required: true },
}, { _id: false })

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    variants: { type: [variantSchema], required: true },
    description: { type: String },
    image: { type: String },
    images: { type: [String], default: [] },
    tagline: { type: String },
    details: { type: String },
    material: { type: String },
    processingTime: { type: String },
    careInstructions: { type: String },
    shippingInfo: { type: String },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Product", productSchema)
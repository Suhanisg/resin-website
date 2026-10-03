const mongoose = require("mongoose")

const variantSchema = new mongoose.Schema({
  size: { type: String },
  price: { type: Number },
}, { _id: false })

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    variants: { type: [variantSchema], default: [] },
    description: { type: String },
    image: { type: String },
    images: { type: [String], default: [] },
    tagline: { type: String },
    details: { type: String },
    material: { type: String },
    processingTime: { type: String },
    careInstructions: { type: String },
    shippingInfo: { type: String },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      default: null,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Product", productSchema)
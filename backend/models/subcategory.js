const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true }, // category ka naam, products jaisa hi
    image: { type: String, default: "" },

    // Is subcategory ke saare products ke popup mein dikhne wale sections
    details: { type: String, default: "" },
    material: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subcategory", subcategorySchema);
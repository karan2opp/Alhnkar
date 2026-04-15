import Product from "../product/productModels.js"
import User from "../auth/authModels.js"
import mongoose from "mongoose"
const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  user:    { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
 images: [{ url: { type: String }, publicId: { type: String } }]  // array of Cloudinary URLs
}, { timestamps: true })

reviewSchema.index({ product: 1, user: 1 }, { unique: true })

export default mongoose.model("Review",reviewSchema)
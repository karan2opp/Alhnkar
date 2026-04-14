
import mongoose from "mongoose"


const categorySchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true, unique: true, lowercase: true },
  image:    { type: String },
  sizeType: { type: String, enum: ["clothing", "bottom", "freesize"], required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.model("Category", categorySchema)

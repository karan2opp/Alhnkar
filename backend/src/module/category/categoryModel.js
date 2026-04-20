
import mongoose from "mongoose"


// categoryModel.js
const categorySchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true, unique: true, lowercase: true },
  image:    {
    url:      { type: String },
    publicId: { type: String }  // ✅ needed for deletion later
  },
  sizeType: { type: String, enum: ["clothing", "bottom", "freesize"], required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.model("Category", categorySchema)

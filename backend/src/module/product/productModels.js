import mongoose from "mongoose";
const variantSchema = new mongoose.Schema({
  size:  { type: String, required: true }, // ✅ plain string, no enum
  stock: { type: Number, default: 0, min: 0 }
}, { _id: false })
const productSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        lowercase:true,
        minLength:3,
        maxlength:30,
        trim:true

    },
    description:{
        type:String,
        required:true,
        lowercase:true,
        minLength:10,
        maxlength:250
    },
    gender:{
      type:String,
      enum:["men", "women", "kids", "unisex"]
    },
     category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, 
    price:{ type: Number, required: true },
    images: [{ url: { type: String }, publicId: { type: String } }],
variants: [variantSchema],             
  isActive: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0 },
totalReviews:  { type: Number, default: 0 }
})

export default mongoose.model("Product",productSchema)
import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  size:     { type: String, required: true }, // comes from product variants
  quantity: { type: Number, required: true, min: 1 },
  price:    { type: Number, required: true }  // snapshot at order time
}, { _id: false })

const orderSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items:  [orderItemSchema],
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "delivered", "cancelled"], default: "pending" },
   paymentMethod: { type: String, enum: ["upi", "card", "cod"], required: true },
  deliveryAddress: {
    street:  { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    pincode: { type: String, required: true }
  }
}, { timestamps: true })

export default mongoose.model("Order", orderSchema)
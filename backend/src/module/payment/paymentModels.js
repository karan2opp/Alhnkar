import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema({
  order:         { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  amount:        { type: Number, required: true },
  status:        { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  paymentMethod: { type: String, enum: ["upi", "card", "cod"], required: true },
  transactionId: { type: String }
}, { timestamps: true })

export default mongoose.model("Payment", paymentSchema)
import mongoose from "mongoose"

const shipmentSchema = new mongoose.Schema({
  order:          { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  address:        { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
  trackingNumber: { type: String },
  status:         { type: String, enum: ["pending", "ontheway", "delivered"], default: "pending" },
  deliveryDate:   { type: Date }
}, { timestamps: true })

export default mongoose.model("Shipment", shipmentSchema)
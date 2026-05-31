import crypto from "crypto";
import { razorpay } from "../../common/config/razorPay.js";

export const createRazorpayOrder = async (
  amount
) => {
  const order =
    await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
    });

  return order;
};

export const verifyPayment = async (
  data
) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = data;

  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

  const isValid =
    expectedSignature ===
    razorpay_signature;

  return {
    success: isValid,
  };
};
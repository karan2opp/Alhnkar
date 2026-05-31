import * as paymentService from "./paymentService.js";

export const createPaymentOrder = async (
  req,
  res,
  next
) => {
  try {
    const { amount } = req.body;

    const order =
      await paymentService.createRazorpayOrder(
        amount
      );

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await paymentService.verifyPayment(
        req.body
      );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
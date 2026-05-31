import { Router } from "express";
import * as controller from "./paymentController.js";
import { authenticate } from "../auth/authMiddleware.js";

const router = Router();

router.post(
  "/create-order",
  authenticate,
  controller.createPaymentOrder
);

router.post(
  "/verify",
  authenticate,
  controller.verifyPayment
);

export default router;
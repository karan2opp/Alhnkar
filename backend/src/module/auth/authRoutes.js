import {Router} from "express"
import validate from "../../common/middleware/validateMiddleware.js"
import registerDto from "./dto/registerDto.js"
import * as controller from "./authController.js"
import LoginDto from "./dto/logintDto.js"
import { authenticate } from "./authMiddleware.js"
import ForgotPasswordDto from "./dto/forgotPasswordDto.js"
import ResetPasswordDto from "./dto/resetPasswordDto.js"

const router=Router()

router.post("/register",validate(registerDto),controller.register);
router.post("/login",validate(LoginDto),controller.login)
router.post("/refreshToken", controller.refreshToken);
router.post("/logout", authenticate, controller.logout);
router.get("/verifyEmail/:token", controller.verifyEmail);
router.post(
  "/forgotPassword",
  validate(ForgotPasswordDto),
  controller.forgotPassword,
);
router.put(
  "/resetPassword/:token",
  validate(ResetPasswordDto),
  controller.resetPassword,
);
router.get("/me", authenticate, controller.getMe);

export default router;
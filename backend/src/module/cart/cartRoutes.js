import Router from "express"
import { authenticate } from "../auth/authMiddleware.js";
import * as controller from "./cartControllers.js"
import addToCartDto from "./dto/addToCartDto.js";
import { updateCartDto } from "./dto/updateCartDto.js";
import validate from "../../common/middleware/validateMiddleware.js";

const router=Router();

router.post("/addToCart",authenticate,validate(addToCartDto), controller.addToCart)
router.post("/updateCart",authenticate,validate(updateCartDto),controller.updateCart)
router.get("/getCart", authenticate, controller.fetchCart)
export default router;
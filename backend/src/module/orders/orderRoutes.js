import { Router } from "express"
import { authenticate } from "../auth/authMiddleware.js"
import { authorize } from "../auth/authMiddleware.js"
import validate from "../../common/middleware/validateMiddleware.js"
import { createOrderDto } from "./dto/createOrderDto.js"
import { updateOrderDto } from "./dto/updateOrderDto.js"
import * as controller from "./orderControllers.js"

const router = Router()

// user routes
router.post("/createOrder", authenticate, validate(createOrderDto), controller.createOrder)
router.patch("/cancelOrder/:id", authenticate, controller.cancelOrder)

// admin only
router.patch("/updateOrder/:id", authenticate, authorize("admin"), validate(updateOrderDto), controller.updateOrder)
// user routes
router.get("/getOrder/:id", authenticate, controller.getOrderById)
router.get("/getOrders", authenticate, controller.getAllOrders)

// admin routes
router.get("/admin/getAllOrders", authenticate, authorize("admin"), controller.getAllOrdersAdmin)
export default router
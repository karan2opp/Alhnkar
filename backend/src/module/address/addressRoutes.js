import { Router } from "express"
import { authenticate } from "../auth/authMiddleware.js"
import validate from "../../common/middleware/validateMiddleware.js"
import { createAddressDto } from "./dto/createAddressDto.js"
import { updateAddressDto } from "./dto/updateAddressDto.js"
import * as controller from "./addressControlers.js"

const router = Router()

router.post("/createAddress", authenticate, validate(createAddressDto), controller.createAddress)
router.patch("/updateAddress/:id", authenticate, validate(updateAddressDto), controller.updateAddress)
router.delete("/deleteAddress/:id", authenticate, controller.deleteAddress)
router.get("/getAddresses", authenticate, controller.getAddresses)

export default router
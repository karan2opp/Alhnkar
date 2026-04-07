import { Router } from "express"
import { authenticate } from "../auth/authMiddleware.js"
import { authorize } from "../auth/authMiddleware.js"
import { upload } from "../../common/middleware/multer.middleware.js"
import validate from "../../common/middleware/validateMiddleware.js"
import { createCategoryDto } from "./dto/createCategoryDto.js"
import * as controller from "./categoryController.js"

const router = Router()

router.post(
  "/createCategory",
  authenticate,
  authorize("admin"),
  upload.single("image"),  // single image for category
  validate(createCategoryDto),
  controller.createCategory
)

export default router;
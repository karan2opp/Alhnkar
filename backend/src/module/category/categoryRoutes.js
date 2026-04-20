import { Router } from "express"
import { authenticate } from "../auth/authMiddleware.js"
import { authorize } from "../auth/authMiddleware.js"
import { upload } from "../../common/middleware/multer.middleware.js"
import validate from "../../common/middleware/validateMiddleware.js"
import  createCategoryDto  from "./dto/createCategoryDto.js"
import { updateCategoryDto } from "./Dto/updateCategoryDto.js"
import * as controller from "./categoryController.js"

const router = Router()

router.post(
  "/createCategory",
  authenticate,
  authorize("admin"),
  upload.single("image"),  
  validate(createCategoryDto),
  controller.createCategory
)
router.patch(
  "/updateCategory/:id",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  validate(updateCategoryDto),
  controller.updateCategory
)

router.delete(
  "/deleteCategory/:id",
  authenticate,
  authorize("admin"),
  controller.deleteCategory
)
router.get(
  "/",
  controller.getAllCategories  // public route — no auth needed
)
export default router;
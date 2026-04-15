import {Router} from "express"
import { parseFormData } from "./productMiddleware.js"
import { authorize,authenticate } from "../auth/authMiddleware.js"
import validate from "../../common/middleware/validateMiddleware.js"
import { CreateProductDto } from "./dto/createProductDto.js"
import * as controller from "./productController.js"
import { UpdateProductDto } from "./dto/updateProductDto.js"
import { upload } from "../../common/middleware/multer.middleware.js"
const router=Router()


router.post(
  "/createProduct",
  authenticate,
  authorize("admin"),
  upload.array("images", 5),
  parseFormData,
  validate(CreateProductDto),
  controller.createProduct
)
// update product details
router.patch(
  "/updateProduct/:id",
  authenticate,
  authorize("admin"),
  upload.array("images", 5),
  parseFormData,
  validate(UpdateProductDto),
  controller.updateProduct
)
// update product images
router.patch(
  "/updateImages/:id",
  authenticate,
  authorize("admin"),
  upload.array("images", 5),

  controller.uploadProductImages
)

// delete product
router.patch(
  "/deleteProduct/:id",
  authenticate,
  authorize("admin"),
  controller.deleteProduct
)

// get single product
router.get(
  "/getProduct/:id",
  controller.getProductById
)

// get all products
router.get(
  "/getAllProducts",
  controller.getAllProduct
)
export default router;
import Router from "express"
import { authenticate } from "../auth/authMiddleware.js"
import { upload } from "../../common/middleware/multer.middleware.js"
import * as controller from "./reviewControllers.js"
import AddReviewDto from "./dto/addReviewDto.js"
import validate from "../../common/middleware/validateMiddleware.js"
import DeleteReviewDto from "./dto/deleteReviewDto.js"
import UpdateReviewDto from "./dto/updateReviewDto.js"
import GetReviewsByUserDto from "./dto/getReviewByUserDto.js"
import GetReviewsByProductDto from "./dto/getReviewByProductDto.js"
const router=Router()

router.post("/addReview",authenticate,upload.array("images",2),validate(AddReviewDto),controller.addReview)
router.delete(
  "/deleteReview/:id",
  authenticate,
  validate(DeleteReviewDto),
  controller.deleteReview
);
router.patch(
  "/updateReview/:id",
  authenticate,
  upload.array("images", 2),
  validate(UpdateReviewDto),
  controller.updateReview
);
router.get("/getReviewByUser/:id",authenticate,validate(GetReviewsByUserDto),controller.getReviewsByUserId)
router.get("/getReviewByProduct/:id",validate(GetReviewsByProductDto),controller.getReviewsByProductId)
export default router;
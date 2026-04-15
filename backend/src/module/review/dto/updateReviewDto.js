import Joi from "joi";
import baseDto from "../../../common/dto/baseDto.js";

class UpdateReviewDto extends baseDto {
  static schema = Joi.object({
    rating: Joi.number().min(1).max(5).optional(),

    comment: Joi.string()
      .max(500)
      .allow("")
      .optional(),

    deleteImages: Joi.array()
      .items(Joi.string())
      .optional()
  }).min(1);
}
export default UpdateReviewDto;
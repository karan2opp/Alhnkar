import Joi from "joi";
import baseDto from "../../../common/dto/baseDto.js";

class AddReviewDto extends baseDto {
  static schema = Joi.object({
    productId: Joi.string().required(),

    rating: Joi.number()
      .min(1)
      .max(5)
      .required(),

    comment: Joi.string()
      .max(500)
      .allow("")
      .optional()
  });
}

export default AddReviewDto;
import Joi from "joi";
import baseDto from "../../../common/dto/baseDto.js";

class DeleteReviewDto extends baseDto {
  static schema = Joi.object({
    id: Joi.string()
      .hex()
      .length(24)
      .required()
  });
}

export default DeleteReviewDto;
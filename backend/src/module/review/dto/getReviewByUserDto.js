import Joi from "joi";
import baseDto from "../../../common/dto/baseDto.js";

class GetReviewsByUserDto extends baseDto {
  static schema = Joi.object({
    userId: Joi.string().hex().length(24).required(),

    page: Joi.number().min(1).optional().default(1),

    limit: Joi.number().min(1).max(20).optional().default(10)
  });
}

export default GetReviewsByUserDto;
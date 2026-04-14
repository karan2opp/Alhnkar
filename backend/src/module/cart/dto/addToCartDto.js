import Joi from "joi";
import baseDto from "../../../common/dto/baseDto.js";
import { ALL_SIZES } from "../../../common/config/sizes.js";
class addToCartDto extends baseDto{
    static schema=Joi.object({
  productId: Joi.string()
    .hex()
    .length(24)
    .required(),

  size: Joi.string()
    .valid(...ALL_SIZES)
    .required()
    .messages({
      "any.only": `Size must be one of: ${ALL_SIZES.join(", ")}`,
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .required(),
});
}

export default addToCartDto;
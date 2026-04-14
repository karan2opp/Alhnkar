import Joi from "joi";
import baseDto from "../../../common/dto/baseDto.js";
import { ALL_SIZES } from "../../../common/config/sizes.js";

class updateCartDto extends baseDto{
    static schema=Joi.object({
  productId: Joi.string()
    .hex()
    .length(24)
    .required(),
  size: Joi.string()
    .valid(...ALL_SIZES)
    .required(),

  action: Joi.string()
    .valid("increment", "decrement", "remove", "setQuantity")
    .required(),

});
}

export {updateCartDto};
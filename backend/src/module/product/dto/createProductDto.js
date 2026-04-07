import Joi from "joi";
import baseDto from "../../../common/dto/baseDto.js";

const variantSchema = Joi.object({
  size:  Joi.string().valid("XS", "S", "M", "L", "XL", "2XL", "3XL").required(),
  stock: Joi.number().min(0).default(0)
})
class createProductDto extends baseDto{
    static schema=Joi.object({
        title:Joi.string().required().min(3).max(50).trim(),
        description:Joi.string().required().min(10).max(250).trim(),
        price:Joi.number().positive().required().min(1),
       category:    Joi.string().hex().length(24),
        isActive:Joi.boolean().default(true),
        gender:Joi.string().valid("men", "women", "kids", "unisex").required(),
        variants: Joi.array().items(variantSchema).min(1).required(),
    })
}

export {variantSchema,createProductDto}
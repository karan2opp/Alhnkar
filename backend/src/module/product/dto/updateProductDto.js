import Joi from "joi"
import baseDto from "../../../common/dto/baseDto.js"
import { variantSchema } from "./createProductDto.js"

class updateProductDto extends baseDto {
  static schema = Joi.object({
    title:       Joi.string().min(3).max(50).trim(),
    description: Joi.string().min(10).max(250).trim(),
    price:       Joi.number().positive().min(1),
    category:    Joi.string().hex().length(24),
    isActive:    Joi.boolean(),
    gender:      Joi.string().valid("men", "women", "kids", "unisex"),
    variants:    Joi.array().items(variantSchema)
  }).min(1) // at least one field required
}

export { updateProductDto }
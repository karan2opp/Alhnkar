import Joi from "joi"
import baseDto from "../../../common/dto/baseDto.js"

class updateCategoryDto extends baseDto {
  static schema = Joi.object({
    name:     Joi.string().min(3).max(50).trim(),
    sizeType: Joi.string().valid("clothing", "bottom",  "freesize"), // ✅ add
    isActive: Joi.boolean()
  }).min(1)
}

export { updateCategoryDto }
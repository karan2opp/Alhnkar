import Joi from "joi"
import baseDto from "../../../common/dto/baseDto.js"

class createCategoryDto extends baseDto {
  static schema = Joi.object({
    name:     Joi.string().required().min(3).max(50).trim(),
    isActive: Joi.boolean().default(true)
  })
}

export { createCategoryDto }
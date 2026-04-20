import Joi from "joi"
import baseDto from "../../../common/dto/baseDto.js"

class updateProfileDto extends baseDto {
  static schema = Joi.object({
    name:  Joi.string().min(3).max(50).trim(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/) // 10 digit number only
  }).min(1)
}

export { updateProfileDto }
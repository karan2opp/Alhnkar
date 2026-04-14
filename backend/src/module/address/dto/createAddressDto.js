import Joi from "joi"
import baseDto from "../../../common/dto/baseDto.js"

class createAddressDto extends baseDto {
  static schema = Joi.object({
    street:    Joi.string().required().trim(),
    city:      Joi.string().required().trim(),
    state:     Joi.string().required().trim(),
    pincode:   Joi.string().required().trim().length(6),
    isDefault: Joi.boolean().default(false)
  })
}

export { createAddressDto }
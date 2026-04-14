import Joi from "joi"
import baseDto from "../../../common/dto/baseDto.js"

class updateAddressDto extends baseDto {
  static schema = Joi.object({
    street:    Joi.string().trim(),
    city:      Joi.string().trim(),
    state:     Joi.string().trim(),
    pincode:   Joi.string().trim().length(6),
    isDefault: Joi.boolean()
  }).min(1)
}

export { updateAddressDto }
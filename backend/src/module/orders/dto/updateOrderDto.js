import Joi from "joi"
import baseDto from "../../../common/dto/baseDto.js"

class updateOrderDto extends baseDto {
  static schema = Joi.object({
    status: Joi.string().valid("pending", "confirmed", "cancelled").required()
  })
}

export { updateOrderDto }
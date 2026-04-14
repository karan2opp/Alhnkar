import Joi from "joi"
import baseDto from "../../../common/dto/baseDto.js"

const orderItemSchema = Joi.object({
  product:  Joi.string().hex().length(24).required(),
  size:     Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
})

class createOrderDto extends baseDto {
  static schema = Joi.object({
    items:     Joi.array().items(orderItemSchema).min(1).required(),
    addressId: Joi.string().hex().length(24).required(), // fetch address using this
    paymentMethod: Joi.string().valid("upi", "card", "cod").required()
  })
}

export { createOrderDto }
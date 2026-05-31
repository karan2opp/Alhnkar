import Joi from "joi"
import baseDto from "../../../common/dto/baseDto.js"

const orderItemSchema = Joi.object({
  product:  Joi.string().hex().length(24).required(),
  size:     Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
})

const deliveryAddressSchema = Joi.object({
  street:  Joi.string().required().trim().min(5),
  city:    Joi.string().required().trim().min(2),
  state:   Joi.string().required().trim().min(2),
  pincode: Joi.string().required().length(6).pattern(/^[1-9][0-9]{5}$/).messages({
    "string.pattern.base": "Invalid pincode format",
    "string.length":       "Pincode must be 6 digits"
  })
})

class createOrderDto extends baseDto {
  static schema = Joi.object({
    items:           Joi.array().items(orderItemSchema).min(1).required(),
    paymentMethod:   Joi.string().valid("razorpay", "cod").required(),
    addressId:       Joi.string().hex().length(24),
    deliveryAddress: deliveryAddressSchema
  }).xor("addressId", "deliveryAddress") 
}

export { createOrderDto }
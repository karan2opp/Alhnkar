import Joi from "joi";
import baseDto from "../../../common/dto/baseDto.js";
import { ALL_SIZES } from "../../../common/config/sizes.js";

const variantSchema = Joi.object({
  size: Joi.string()
    .valid(...ALL_SIZES)
    .required()
    .messages({
      "any.only": `Size must be one of: ${ALL_SIZES.join(", ")}`,
    }),

  stock: Joi.number()
    .min(0)
    .default(0)
});

class CreateProductDto extends baseDto {
  static schema = Joi.object({
    title: Joi.string()
      .min(3)
      .max(50)
      .trim()
      .required(),

    description: Joi.string()
      .min(10)
      .max(250)
      .trim()
      .required(),

    price: Joi.number()
      .positive()
      .min(1)
      .required(),

    category: Joi.string()
      .hex()
      .length(24)
      .required(),

    isActive: Joi.boolean().default(true),

    gender: Joi.string()
      .valid("men", "women", "kids", "unisex")
      .required(),

    variants: Joi.array()
      .items(variantSchema)
      .min(1)
      .required()
  });
}

export { CreateProductDto, variantSchema };
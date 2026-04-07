import Category from "./categoryModel.js"
import ApiError from "../../common/utils/apiError.js"
import { uploadToCloudinary } from "../../common/config/cloudinary.js"

export const createCategory = async (categoryInfo, imageFile) => {
  const { name, isActive } = categoryInfo

  const isFound = await Category.findOne({ name })
  if (isFound) throw ApiError.conflict("Category already exists")

  let image
  if (imageFile) {
    image = await uploadToCloudinary(imageFile.buffer, "categories")
  }

  const category = await Category.create({ name, isActive, image })
  return category
}
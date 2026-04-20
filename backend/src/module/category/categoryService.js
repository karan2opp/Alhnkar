import Category from "./categoryModel.js"
import ApiError from "../../common/utils/apiError.js"
import { uploadToCloudinary } from "../../common/config/cloudinary.js"

export const createCategory = async (categoryInfo, imageFile) => {
  const { name, isActive, sizeType } = categoryInfo

  const isFound = await Category.findOne({ name })
  if (isFound) throw ApiError.conflict("Category already exists")

  let image
  if (imageFile) {
    image = await uploadToCloudinary(imageFile.buffer, "categories")
    // ✅ now image = { url: "...", publicId: "..." }
  }

  const category = await Category.create({ name, isActive, sizeType, image })
  return category
}

export const updateCategory = async (categoryId, categoryInfo, imageFile) => {
  const isFound = await Category.findById(categoryId)
  if (!isFound) throw ApiError.notFound("Category not found")

  const obj = {}

  if (categoryInfo.name)                   obj.name     = categoryInfo.name
  if (categoryInfo.sizeType)               obj.sizeType = categoryInfo.sizeType
  if (categoryInfo.isActive !== undefined) obj.isActive = categoryInfo.isActive

  if (imageFile) {
    // delete old image from cloudinary first
    if (isFound.image?.publicId) {
      await deleteFromCloudinary(isFound.image.publicId)
    }
    obj.image = await uploadToCloudinary(imageFile.buffer, "categories")
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    { $set: obj },
    { new: true, runValidators: true }
  )

  return category
}

export const deleteCategory = async (categoryId) => {
  const category = await Category.findByIdAndUpdate(
    categoryId,
    { $set: { isActive: false } },
    { new: true }
  )
  if (!category) throw ApiError.notFound("Category not found")
  return category
}
export const getAllCategories = async (query) => {
  const { isActive, sizeType } = query

  const filter = {}
  if (isActive  !== undefined) filter.isActive  = isActive === "true"
  if (sizeType)                filter.sizeType  = sizeType

  const categories = await Category.find(filter).sort({ createdAt: -1 })
  return categories
}
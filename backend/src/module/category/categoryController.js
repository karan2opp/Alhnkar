import * as categoryService from "./categoryService.js"
import ApiResponse from "../../common/utils/apiResponse.js"

export const createCategory = async (req, res) => {
  const category = await categoryService.createCategory(req.body, req.file)
  ApiResponse.created(res, "Category created successfully", category)
}

export const updateCategory = async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body, req.file)
  ApiResponse.ok(res, "Category updated successfully", category)
}

export const deleteCategory = async (req, res) => {
  const category = await categoryService.deleteCategory(req.params.id)
  ApiResponse.ok(res, "Category deleted successfully", category)
}
export const getAllCategories = async (req, res) => {
  
  
  const categories = await categoryService.getAllCategories(req.query)


  ApiResponse.ok(res, "Categories fetched successfully", categories)
}
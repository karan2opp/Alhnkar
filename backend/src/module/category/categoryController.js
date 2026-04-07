import * as categoryService from "./categoryService.js"
import ApiResponse from "../../common/utils/apiResponse.js"

export const createCategory = async (req, res) => {
  const category = await categoryService.createCategory(req.body, req.file)
  ApiResponse.created(res, "Category created successfully", category)
}
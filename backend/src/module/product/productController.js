import ApiResponse from "../../common/utils/apiResponse.js";
import * as productService from "./productService.js"
const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.body, req.files)
  ApiResponse.created(res, "Product created successfully", product)
}

const updateProduct = async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.files)
  ApiResponse.ok(res, "Product updated successfully", product)
}

const deleteProduct = async (req, res) => {
  const product = await productService.deleteProduct(req.params.id)
  ApiResponse.ok(res, "Product deleted successfully", product)
}

const getProductById = async (req, res) => {
  const product = await productService.getProductById(req.params.id)
  ApiResponse.ok(res, "Product fetched successfully", product)
}

const getAllProduct = async (req, res) => {
  const { products, hasMore } = await productService.getAllProduct(req.query) 
  ApiResponse.ok(res, "Products fetched successfully", { products, hasMore })
}
export const uploadProductImages = async (req, res) => {
  const product = await productService.uploadProductImages(req.params.id, req.files)
  ApiResponse.ok(res, "Images uploaded successfully", product)
}

export {createProduct,updateProduct,deleteProduct,getAllProduct,getProductById}
import { uploadToCloudinary } from "../../common/config/cloudinary.js";

import Product from "./productModels.js";
import { getIO } from "../socket/socket.js";
import ApiError from "../../common/utils/apiError.js";


 const createProduct = async (productInfo, imageFiles) => {
  const { title, description, price, variants, gender, category, isActive } = productInfo

  const imageUrls = imageFiles?.length
    ? await Promise.all(imageFiles.map(file => uploadToCloudinary(file.buffer, "products")))
    : []

  const product = await Product.create({
    title,
    description,
    price,
    gender,
    category,   
    isActive,
    variants,   
    images: imageUrls
  })

  getIO().to("user_room").emit("new_product", {
    message: "New product just dropped!",
    product
  })

  return product
}

 const updateProduct = async (productId, productInfo, imageFiles) => {
  
  const { title, description, price, variants, isActive, gender, category } = productInfo

  const isFound = await Product.findById(productId)
  if (!isFound) throw ApiError.notFound("Product not found")

  const obj = {}

  if (title)               obj.title       = title
  if (description)         obj.description = description
  if (price)               obj.price       = price
  if (gender)              obj.gender      = gender
  if (category)            obj.category    = category  
  if (isActive !== undefined) obj.isActive = isActive
  if (variants)            obj.variants    = variants 

  if (imageFiles?.length) {
    const newImageUrls = await Promise.all(
      imageFiles.map(file => uploadToCloudinary(file.buffer, "products"))
    )
    obj.images = [...isFound.images, ...newImageUrls]
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    { $set: obj },
    { new: true, runValidators: true }
  ).populate("category", "name") 

  getIO().to("user_room").emit("product_updated", {
    message: "Product updated",
    product
  })

  return product
}

const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { $set: { isActive: false } },
    { new: true }
  )
  if (!product) throw ApiError.notFound("Product not found")

  getIO().to("user_room").emit("product_deleted", {
    message: "A product has been removed",
    productId
  })

  return product
}
 const getProductById = async (productId) => {
  const product = await Product.findById(productId)
    .populate("category", "name") 
  if (!product) throw ApiError.notFound("Product not found")
  return product
}

const getAllProduct = async (query) => {
  const { category, gender, page = 1, limit = 10 } = query

  const filter = { isActive: true }
  if (category) filter.category = category
  if (gender)   filter.gender   = gender

  const products = await Product.find(filter)
    .populate("category", "name") 
    .skip((page - 1) * limit)
    .limit(Number(limit) + 1)
    .sort({ createdAt: -1 })

  const hasMore = products.length > limit
  if (hasMore) products.pop()

  return { products, hasMore }
}

 const uploadProductImages = async (productId, imageFiles) => {
  const product = await Product.findById(productId)
  if (!product) throw ApiError.notFound("Product not found")

  if (!imageFiles?.length) throw ApiError.badRequest("No images provided")

  const newImageUrls = await Promise.all(
    imageFiles.map(file => uploadToCloudinary(file.buffer, "products"))
  )

  product.images = [...product.images, ...newImageUrls]
  await product.save()

  return product
}

export {createProduct,updateProduct,getAllProduct,getProductById,deleteProduct,uploadProductImages}
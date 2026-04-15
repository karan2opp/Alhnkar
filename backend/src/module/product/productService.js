import { uploadToCloudinary,deleteFromCloudinary } from "../../common/config/cloudinary.js";

import Product from "./productModels.js";
import { getIO } from "../socket/socket.js";
import ApiError from "../../common/utils/apiError.js";
import Review from "../review/reviewModels.js"
import mongoose from "mongoose";
 import { SIZES } from "../../common/config/sizes.js"
import Category from "../category/categoryModel.js"


const createProduct = async (productInfo, imageFiles) => {
  const { title, description, price, variants, gender, category, isActive } = productInfo;

  const categoryDoc = await Category.findById(category);
  if (!categoryDoc) throw ApiError.notFound("Category not found");

  const allowedSizes = SIZES[categoryDoc.sizeType];
  variants.forEach(variant => {
    if (!allowedSizes.includes(variant.size)) {
      throw ApiError.badRequest(`Invalid size "${variant.size}"`);
    }
  });

  let imageUrls = [];

  try {
    imageUrls = imageFiles?.length
      ? await Promise.all(
          imageFiles.map(file => uploadToCloudinary(file.buffer, "products"))
        )
      : [];

    if (imageUrls.length > 5) {
      throw ApiError.badRequest("Maximum 5 images allowed");
    }

    const product = await Product.create({
      title, description, price, gender,
      category, isActive, variants, images: imageUrls
    });

    return product;

  } catch (err) {
    if (imageUrls.length) {
      await Promise.allSettled(
        imageUrls.map(img => deleteFromCloudinary(img.publicId))
      );
    }
    throw ApiError.internal("Failed to create product");
  }
};
const updateProduct = async (productId, productInfo, imageFiles) => {
  const { title, description, price, variants, isActive, gender, category, deleteImages = [] } = productInfo;

  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound("Product not found");

  // 🔹 Update basic fields
  if (title) product.title = title;
  if (description) product.description = description;
  if (price) product.price = price;
  if (gender) product.gender = gender;
  if (category) product.category = category;
  if (isActive !== undefined) product.isActive = isActive;
  if (variants) product.variants = variants;

  // 🔹 Step 1: Delete selected images
  if (deleteImages.length) {
    await Promise.allSettled(
      deleteImages.map(id => deleteFromCloudinary(id))
    );

    product.images = product.images.filter(
      img => !deleteImages.includes(img.publicId)
    );
  }

  // 🔹 Step 2: Upload new images
  let newImages = [];
  if (imageFiles?.length) {
    newImages = await Promise.all(
      imageFiles.map(file => uploadToCloudinary(file.buffer, "products"))
    );
  }

  // 🔹 Step 3: Check limit (max 5)
  const totalImages = [...product.images, ...newImages];
  if (totalImages.length > 5) {
    // rollback new uploads
    await Promise.allSettled(
      newImages.map(img => deleteFromCloudinary(img.publicId))
    );

    throw ApiError.badRequest("Maximum 5 images allowed");
  }

  product.images = totalImages;

  await product.save();

  getIO().to("user_room").emit("product_updated", {
    message: "Product updated",
    product
  });

  return product;
};

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
const updateProductRating = async (productId) => {
  const result = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { 
        _id: "$product", 
        avg: { $avg: "$rating" }, 
        count: { $sum: 1 } 
    }}
  ])

  const avg   = result[0]?.avg   ?? 0
  const count = result[0]?.count ?? 0

  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(avg * 10) / 10,
    totalReviews:  count
  })
}
export {createProduct,updateProduct,getAllProduct,getProductById,deleteProduct,uploadProductImages,updateProductRating}
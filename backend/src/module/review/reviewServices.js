import Product from "../product/productModels.js"
import ApiError from "../../common/utils/apiError.js"
import Review from "./reviewModels.js"
import { uploadToCloudinary,deleteFromCloudinary } from "../../common/config/cloudinary.js"
import { updateProductRating } from "../product/productService.js"
const addReview = async (reviewInfo, userId, imageFiles) => {
  const { productId, comment, rating } = reviewInfo

  const foundProduct = await Product.findById(productId)
  if (!foundProduct) throw ApiError.notFound("Product not found")

  const existingReview = await Review.findOne({ product: productId, user: userId })
  if (existingReview) throw ApiError.badRequest("You have already reviewed this product")

  const images = imageFiles?.length
    ? await Promise.all(imageFiles.map(file => uploadToCloudinary(file.buffer, "reviews")))
    : []

  try {
    const review = await Review.create({
      product: productId,
      user:    userId,
      rating,
      comment,
      images   // [{ url, publicId }]
    })

    await updateProductRating(productId)
    return review

  } catch (err) {
    if (images.length) {
      await Promise.allSettled(
        images.map(img => deleteFromCloudinary(img.publicId))
      )
    }
    throw ApiError.badRequest("Failed to save review")
  }
}
const deleteReview = async (reviewId, userId) => {
  const review = await Review.findOne({ _id: reviewId, user: userId })
  if (!review) throw ApiError.notfound("Review not found")

  if (review.images.length) {
    await Promise.allSettled(
      review.images.map(img => deleteFromCloudinary(img.publicId))
    )
  }

  await review.deleteOne()
  await updateProductRating(review.product)
}
const updateReview = async (reviewId, userId, updateData, imageFiles) => {
  const review = await Review.findOne({ _id: reviewId, user: userId });
  if (!review) throw ApiError.notFound("Review not found");

  const { deleteImages = [] } = updateData;

  // 🔹 Step 1: Delete selected images
  if (deleteImages.length) {
    await Promise.allSettled(
      deleteImages.map(id => deleteFromCloudinary(id))
    );

    review.images = review.images.filter(
      img => !deleteImages.includes(img.publicId)
    );
  }

  // 🔹 Step 2: Upload new images
  let newImages = [];
  if (imageFiles?.length) {
    newImages = await Promise.all(
      imageFiles.map(file =>
        uploadToCloudinary(file.buffer, "reviews")
      )
    );
  }

  // 🔹 Step 3: Limit to max 2 images
  const totalImages = [...review.images, ...newImages];
  if (totalImages.length > 2) {
    throw ApiError.badRequest("Maximum 2 images allowed");
  }

  review.images = totalImages;

  // 🔹 Step 4: Update other fields
  if (updateData.rating !== undefined) {
    review.rating = updateData.rating;
  }

  if (updateData.comment !== undefined) {
    review.comment = updateData.comment;
  }

  await review.save();
  await updateProductRating(review.product);

  return review;
};

const getReviewsByUserId = async (userId, page, limit) => {
  if (!userId) throw ApiError.badRequest("UserId is required");

  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ user: userId })
      .populate("product", "name price") // optional
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Review.countDocuments({ user: userId })
  ]);

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: reviews
  };
};
const getReviewsByProductId = async (productId, page, limit) => {
  if (!productId) throw ApiError.badRequest("ProductId is required");

  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ product: productId })
      .populate("user", "name email") // optional
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Review.countDocuments({ product: productId })
  ]);

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: reviews
  };
};
export {addReview,deleteReview,updateReview,getReviewsByProductId,getReviewsByUserId}

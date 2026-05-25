// src/review/Reviews.jsx
import { useState, useEffect, useRef } from "react";
import { useReviewStore } from "../store/useReviewStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { Star, Trash2, Edit2, X, Image as ImageIcon } from "lucide-react";
import { showToast } from "../utils/showToast.jsx";

export default function Reviews({ productId }) {
  const { user, isLoggedIn } = useAuthStore();
  const {
    reviews,
    userReviews,
    loading,
    getReviewsByProduct,
    getReviewsByUser,
    addReview,
    updateReview,
    deleteReview,
  } = useReviewStore();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
    images: [],
    imagePreviews: [],
    deleteImages: [],
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const fileInputRef = useRef(null);

  // Fetch reviews on mount
useEffect(() => {
  if (productId) {
    getReviewsByProduct(productId); // ✅ Correct action name
  }
}, [productId, getReviewsByProduct]);

  // Fetch user's reviews when logged in
  useEffect(() => {
    if (isLoggedIn && user?._id && productId) {
      getReviewsByUser(user._id);
    }
  }, [isLoggedIn, user, productId, getReviewsByUser]);

  // Check if user already reviewed this product
  const existingReview = userReviews.find(
    (r) => r.product?._id === productId || r.product === productId
  );

  // Handle rating click
  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 2 - formData.images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, file],
          imagePreviews: [...prev.imagePreviews, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });

    if (files.length > remainingSlots) {
      showToast.error("Maximum 2 images allowed", "", 3000);
    }
  };

  // Remove image from preview
  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  // Remove existing image (for updates)
  const removeExistingImage = (publicId) => {
    setFormData((prev) => ({
      ...prev,
      deleteImages: [...prev.deleteImages, publicId],
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      rating: 0,
      comment: "",
      images: [],
      imagePreviews: [],
      deleteImages: [],
    });
    setEditingReview(null);
    setShowReviewForm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rating === 0) {
      showToast.error("Please select a rating", "", 3000);
      return;
    }

    if (!formData.comment.trim()) {
      showToast.error("Please write a comment", "", 3000);
      return;
    }

    try {
      const payload = {
        rating: formData.rating,
        comment: formData.comment,
        images: formData.images,
        deleteImages: formData.deleteImages,
      };

      if (editingReview) {
        await updateReview(editingReview._id, payload);
        showToast.success("Review updated successfully", "", 2500);
      } else {
        payload.productId = productId;
        await addReview(payload);
        showToast.success("Review added successfully", "", 2500);
      }

      resetForm();
    } catch (error) {
      showToast.error(
        error.response?.data?.message || "Failed to submit review",
        "",
        4000
      );
    }
  };

  // Edit review
  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      rating: review.rating,
      comment: review.comment || "",
      images: [],
      imagePreviews: [],
      deleteImages: [],
    });
    setShowReviewForm(true);
  };

  // Delete review
  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await deleteReview(reviewId);
      showToast.success("Review deleted successfully", "", 2500);
    } catch (error) {
      showToast.error(
        error.response?.data?.message || "Failed to delete review",
        "",
        4000
      );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-serif text-[var(--color-text)]">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-bold text-[var(--color-accent)]">
              {averageRating}
            </span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={
                    star <= Math.round(averageRating)
                      ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                      : "text-[var(--color-muted)]"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-[var(--color-muted)]">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        {isLoggedIn && !existingReview && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-5 py-2.5 bg-[var(--color-primary)] text-bg text-sm font-medium rounded-lg hover:opacity-90 transition"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-serif text-[var(--color-text)]">
              {editingReview ? "Edit Your Review" : "Write a Review"}
            </h3>
            <button
              onClick={resetForm}
              className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-text)] mb-2">
                Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition"
                  >
                    <Star
                      size={28}
                      className={
                        star <= (hoveredRating || formData.rating)
                          ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                          : "text-[var(--color-muted)]"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-text)] mb-1.5">
                Review *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, comment: e.target.value }))
                }
                placeholder="Share your experience with this product..."
                rows="4"
                className="w-full px-3 py-2.5 border border-[var(--color-border-theme)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] text-[13px] outline-none focus:border-[var(--color-primary)] transition resize-none"
                required
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-text)] mb-2">
                Add Photos (max 2)
              </label>
              
              {/* Existing images (for edit mode) */}
              {editingReview?.images?.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {editingReview.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img.url}
                        alt={`Review ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-[var(--color-border-theme)]"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.publicId)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--color-accent)] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New image previews */}
              {formData.imagePreviews.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {formData.imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-[var(--color-border-theme)]"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--color-accent)] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              {formData.images.length < 2 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border-theme)] rounded-lg text-[12px] text-[var(--color-text)] hover:bg-[var(--color-bg)] transition"
                >
                  <ImageIcon size={16} />
                  Choose Images
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-[10px] text-[var(--color-muted)] mt-1">
                JPG, PNG up to 5MB each
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[var(--color-primary)] text-bg py-2.5 text-sm font-medium rounded-lg hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? "Submitting..." : editingReview ? "Update Review" : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 border border-[var(--color-border-theme)] bg-transparent text-[var(--color-text)] py-2.5 text-sm font-medium rounded-lg hover:bg-[var(--color-bg)] transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading && reviews.length === 0 ? (
          <div className="text-center py-10 text-[var(--color-muted)]">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 text-[var(--color-muted)]">
            <p className="mb-2">No reviews yet</p>
            <p className="text-sm">Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-xl p-5"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-medium">
                    {review.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text)]">
                      {review.user?.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Star rating */}
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={
                          star <= review.rating
                            ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                            : "text-[var(--color-muted)]"
                        }
                      />
                    ))}
                  </div>

                  {/* Edit/Delete buttons (only for user's own reviews) */}
                  {user?._id === review.user?._id && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(review)}
                        className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition"
                        title="Edit review"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition"
                        title="Delete review"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Comment */}
              {review.comment && (
                <p className="text-[13px] text-[var(--color-text)] mb-3">
                  {review.comment}
                </p>
              )}

              {/* Images */}
              {review.images?.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {review.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={`Review image ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-[var(--color-border-theme)] cursor-pointer hover:opacity-90 transition"
                      onClick={() => window.open(img.url, "_blank")}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
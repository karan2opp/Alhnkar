// src/review/review.service.js
import api from "../utils/axios.js";

/*
  Fetch reviews for a product
  Response structure:
  {
    success: true,
    message: "...",
    data: {
      total: 10,
      page: 1,
      totalPages: 1,
      data: [ /* reviews array * / ]
    }
  }
*/
// src/review/review.service.js

export const getReviewsByProduct = async (set, productId, page = 1, limit = 10) => {
  try {
    set({ loading: true, error: null });

    const res = await api.get(`/review/getReviewByProduct/${productId}`, {
      params: { page, limit },
    });

 
    const paginationWrapper = res.data?.data;  
    const reviewsArray = Array.isArray(paginationWrapper?.data) 
      ? paginationWrapper.data 
      : [];

  

    set({
      reviews: reviewsArray,  
      pagination: {
        page: paginationWrapper?.page || 1,
        totalPages: paginationWrapper?.totalPages || 1,
        total: paginationWrapper?.total || 0,
      },
      loading: false,
    });

    return reviewsArray;
  } catch (error) {
    set({
      reviews: [],
      loading: false,
      error: error.response?.data?.message || "Failed to fetch reviews",
    });
    throw error;
  }
};

/*
  Fetch reviews by user ID
  */
export const getReviewsByUser = async (set, userId, page = 1, limit = 10) => {
  try {
    set({ loading: true, error: null });

    const res = await api.get(`/review/getReviewByUser/${userId}`, {
      params: { page, limit },
    });

    // ✅ Same extraction logic
    const paginationWrapper = res.data?.data;
    const reviewsArray = Array.isArray(paginationWrapper?.data) 
      ? paginationWrapper.data 
      : [];

    set({
      userReviews: reviewsArray,
      loading: false,
    });

    return reviewsArray;
  } catch (error) {
    set({
      userReviews: [],
      loading: false,
      error: error.response?.data?.message || "Failed to fetch your reviews",
    });
    throw error;
  }
};

export const addReview = async (set, payload) => {
  try {
    set({ loading: true, error: null });

    const formData = new FormData();
    formData.append("productId", payload.productId);
    formData.append("rating", payload.rating);
    formData.append("comment", payload.comment || "");

    if (payload.images?.length) {
      payload.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const res = await api.post("/review/addReview", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // ✅ Extract review from response: res.data.data.data
    const newReview = res.data?.data?.data || res.data?.data || res.data;

    // ✅ Prepend to reviews list
    set((state) => ({
      reviews: [newReview, ...state.reviews],
      loading: false,
    }));

    return newReview;
  } catch (error) {
    set({
      loading: false,
      error: error.response?.data?.message || "Failed to add review",
    });
    console.error("addReview error:", error);
    throw error;
  }
};

/*
  Update an existing review
  payload: { rating, comment, images (File[]), deleteImages (string[]) }
*/
export const updateReview = async (set, reviewId, payload) => {
  try {
    set({ loading: true, error: null });

    const formData = new FormData();

    if (payload.rating !== undefined) {
      formData.append("rating", payload.rating);
    }
    if (payload.comment !== undefined) {
      formData.append("comment", payload.comment);
    }
    if (payload.deleteImages?.length) {
      formData.append("deleteImages", JSON.stringify(payload.deleteImages));
    }
    if (payload.images?.length) {
      payload.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const res = await api.patch(`/review/updateReview/${reviewId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const updatedReview = res.data?.data?.data || res.data?.data || res.data;

    // ✅ Update in both reviews and userReviews
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r._id === reviewId ? updatedReview : r
      ),
      userReviews: state.userReviews.map((r) =>
        r._id === reviewId ? updatedReview : r
      ),
      loading: false,
    }));

    return updatedReview;
  } catch (error) {
    set({
      loading: false,
      error: error.response?.data?.message || "Failed to update review",
    });
    console.error("updateReview error:", error);
    throw error;
  }
};

/*
  Delete a review
*/
export const deleteReview = async (set, reviewId) => {
  try {
    set({ loading: true, error: null });

    await api.delete(`/review/deleteReview/${reviewId}`);

    // ✅ Remove from both lists
    set((state) => ({
      reviews: state.reviews.filter((r) => r._id !== reviewId),
      userReviews: state.userReviews.filter((r) => r._id !== reviewId),
      loading: false,
    }));
  } catch (error) {
    set({
      loading: false,
      error: error.response?.data?.message || "Failed to delete review",
    });
    console.error("deleteReview error:", error);
    throw error;
  }
};
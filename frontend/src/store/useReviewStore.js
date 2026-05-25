// src/store/useReviewStore.js
import { create } from "zustand";
import {
  getReviewsByProduct,
  getReviewsByUser,
  addReview,
  updateReview,
  deleteReview,
} from "../review/reviewService.js";

export const useReviewStore = create((set) => ({
  // ── State ─────────────────────────────────────────────
  reviews: [],
  userReviews: [],
  pagination: { page: 1, totalPages: 1, total: 0 },
  loading: false,
  error: null,

  // ── Actions: Read ─────────────────────────────────────
  getReviewsByProduct: (productId, page, limit) =>
    getReviewsByProduct(set, productId, page, limit),

  getReviewsByUser: (userId, page, limit) =>
    getReviewsByUser(set, userId, page, limit),

  // ── Actions: Write ────────────────────────────────────
  addReview: (payload) => addReview(set, payload),

  updateReview: (reviewId, payload) =>
    updateReview(set, reviewId, payload),

  deleteReview: (reviewId) => deleteReview(set, reviewId),

  // ── Helpers ───────────────────────────────────────────
  clearError: () => set({ error: null }),
}));
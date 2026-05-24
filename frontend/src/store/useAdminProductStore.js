import { create } from "zustand";
import {
  // Re-use existing fetch functions from product.service
  getAllProducts,
  getProductById,
} from "../product/product.service.js";

// Import admin-specific actions
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../admin/adminProduct.service.js";

export const useAdminProductStore = create((set) => ({
  // ── State ─────────────────────────────────────────────
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,

  // ── Actions: Read (re-use existing) ──────────────────
  fetchProducts: (filters) => getAllProducts(set, filters),
  fetchProductById: (productId) => getProductById(set, productId),

  // ── Actions: Write (admin CRUD) ──────────────────────
  createProduct: (payload) => createProduct(set, payload),
  updateProduct: (productId, payload) =>
    updateProduct(set, productId, payload),
  deleteProduct: (productId) => deleteProduct(set, productId),

  // ── Helpers ──────────────────────────────────────────
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  clearError: () => set({ error: null }),
  clearProducts: () => set({ products: [], selectedProduct: null }),
}));
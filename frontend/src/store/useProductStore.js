import { create } from "zustand";
import {
  getAllProducts,
  getProductById,
} from "../product/product.service.js";

export const useProductStore = create((set) => ({
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  setSelectedProduct: (product) =>
  set({
    selectedProduct: product,
  }),

fetchProducts: (filters) =>
  getAllProducts(set, filters),

  fetchProductById: (productId) =>
    getProductById(set, productId),
}));
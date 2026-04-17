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

  fetchProducts: () => getAllProducts(set),

  fetchProductById: (productId) =>
    getProductById(set, productId),
}));
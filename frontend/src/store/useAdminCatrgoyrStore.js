// src/store/useAdminCategoryStore.js
import { create } from "zustand";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../admin/adminCategory.service.js"

export const useAdminCategoryStore = create((set) => ({
  // State
  categories: [],
  loading: false,
  error: null,

  // Actions
  fetchCategories: () => fetchCategories(set),
  createCategory: (payload) => createCategory(set, payload),
  updateCategory: (id, payload) => updateCategory(set, id, payload),
  deleteCategory: (id) => deleteCategory(set, id),
  
  // Helper
  clearError: () => set({ error: null }),
}));
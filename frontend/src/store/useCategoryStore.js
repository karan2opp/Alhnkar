// src/store/useCategoryStore.js

import { create } from "zustand";
import { fetchCategories } from "../category/category.service";

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchAllCategories: () =>
    fetchCategories(set),

  clearCategories: () =>
    set({
      categories: [],
      loading: false,
      error: null,
    }),
}));
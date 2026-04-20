// src/category/category.service.js

import api from "../utils/axios";

export const fetchCategories = async (set) => {
  try {
    set({
      loading: true,
      error: null,
    });

    const res = await api.get("/categories/");
      
    set({
      categories: res.data.data,
      loading: false,
    });

    return res.data.data;
  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to fetch categories",
    });

    console.log(error);
  }
};
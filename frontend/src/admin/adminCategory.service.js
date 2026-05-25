// src/admin/category.service.js
import api from "../utils/axios.js";

/*
  Fetch all categories
*/
export const fetchCategories = async (set) => {
  try {
    set({ loading: true, error: null });
    const res = await api.get("/categories");
    
    set({
      categories: res.data.data || [],
      loading: false,
    });
  } catch (error) {
    set({
      loading: false,
      error: error.response?.data?.message || "Failed to fetch categories",
    });
  }
};

/*
  Create new category
  payload: { name, isActive, sizeType, image (File) }
*/
export const createCategory = async (set, payload) => {
  try {
    set({ loading: true, error: null });
    
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("isActive", payload.isActive ?? true);
    if (payload.sizeType) formData.append("sizeType", payload.sizeType);
    if (payload.image) formData.append("image", payload.image);

    const res = await api.post("/categories/createCategory", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    set((state) => ({
      categories: [...state.categories, res.data.data],
      loading: false,
    }));

    return res.data.data;
  } catch (error) {
    set({
      loading: false,
      error: error.response?.data?.message || "Failed to create category",
    });
    throw error;
  }
};

/*
  Update category
  payload: { name, isActive, sizeType, image (File) }
*/
export const updateCategory = async (set, categoryId, payload) => {
  try {
    set({ loading: true, error: null });
    
    const formData = new FormData();
    if (payload.name) formData.append("name", payload.name);
    if (payload.isActive !== undefined) formData.append("isActive", payload.isActive);
    if (payload.sizeType) formData.append("sizeType", payload.sizeType);
    if (payload.image) formData.append("image", payload.image);

    const res = await api.patch(
      `/categories/updateCategory/${categoryId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    set((state) => ({
      categories: state.categories.map((cat) =>
        cat._id === categoryId ? res.data.data : cat
      ),
      loading: false,
    }));

    return res.data.data;
  } catch (error) {
    set({
      loading: false,
      error: error.response?.data?.message || "Failed to update category",
    });
    throw error;
  }
};

/*
  Delete category (soft delete - sets isActive: false)
*/
export const deleteCategory = async (set, categoryId) => {
  try {
    set({ loading: true, error: null });
    await api.delete(`/categories/deleteCategory/${categoryId}`);
    
    set((state) => ({
      categories: state.categories.filter((cat) => cat._id !== categoryId),
      loading: false,
    }));
  } catch (error) {
    set({
      loading: false,
      error: error.response?.data?.message || "Failed to delete category",
    });
    throw error;
  }
};
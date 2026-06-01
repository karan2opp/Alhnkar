import api from "../utils/axios.js";

/**
 * Create Product (Admin)
 * @param {Function} set - Zustand set function
 * @param {Object} payload - Form data: { title, description, price, category, gender, variants[], images[] }
 * @returns {Promise<Object>} Created product data
 */
export const createProduct = async (set, payload) => {
  try {
    set({ loading: true, error: null });

    // Convert payload to FormData for multipart upload
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("price", payload.price);
    formData.append("category", payload.category);
    formData.append("gender", payload.gender);
    formData.append("isActive", payload.isActive ?? true);

    // Append variants (as JSON string)
    if (payload.variants?.length) {
      formData.append("variants", JSON.stringify(payload.variants));
      console.log("this is variants",payload);
      
    }

    // Append images (FileList or array of File)
    if (payload.images?.length) {
      Array.from(payload.images).forEach((file) => {
        formData.append("images", file);
      });
    }
    
    const res = await api.post("/products/createProduct", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    set({ loading: false });
    return res.data.data;
  } catch (error) {
    set({
      loading: false,
      error: error.response?.data?.message || "Failed to create product",
    });
    console.error("createProduct error:", error);
    throw error;
  }
};

/**
 * Update Product (Admin)
 * @param {Function} set - Zustand set function
 * @param {string} productId - Product ID to update
 * @param {Object} payload - Fields to update + optional images/deleteImages
 * @returns {Promise<Object>} Updated product data
 */
export const updateProduct = async (set, productId, payload) => {
  try {
    set({ loading: true, error: null });

    const formData = new FormData();

    // Append only provided fields (UpdateProductDto requires at least one)
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === null) return;

      if (key === "variants" && Array.isArray(payload[key])) {
        formData.append(key, JSON.stringify(payload[key]));
      } else if (key === "deleteImages" && Array.isArray(payload[key])) {
        payload[key].forEach((publicId) => {
          formData.append("deleteImages", publicId);
        });
      } else if (key === "images" && payload[key]?.length) {
        // New images to upload
        Array.from(payload[key]).forEach((file) => {
          formData.append("images", file);
        });
      } else if (key !== "images") {
        // Primitive fields
        formData.append(key, payload[key]);
      }
    });

    const res = await api.patch(
      `/products/updateProduct/${productId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // Optionally refresh selected product in state
    set((state) => ({
      selectedProduct:
        state.selectedProduct?.id === productId
          ? res.data.data
          : state.selectedProduct,
      loading: false,
    }));

    return res.data.data;
  } catch (error) {
    set({
      loading: false,
      error: error.response?.data?.message || "Failed to update product",
    });
    console.error("updateProduct error:", error);
    throw error;
  }
};

/**
 * Delete Product (Admin) - Soft delete via PATCH
 * @param {Function} set - Zustand set function
 * @param {string} productId - Product ID to delete
 * @returns {Promise<boolean>} Success flag
 */
export const deleteProduct = async (set, productId) => {
  try {
    set({ loading: true, error: null });

    await api.patch(`/products/deleteProduct/${productId}`);

    // Remove deleted product from local state
    set((state) => ({
      products: state.products.filter((p) => p.id !== productId),
      selectedProduct:
        state.selectedProduct?.id === productId
          ? null
          : state.selectedProduct,
      loading: false,
    }));

    return true;
  } catch (error) {
    set({
      loading: false,
      error: error.response?.data?.message || "Failed to delete product",
    });
    console.error("deleteProduct error:", error);
    throw error;
  }
};
import api from "../utils/axios.js"

export const getAllProducts = async (set) => {
  try {
    set({
      loading: true,
      error: null,
    });

    const res = await api.get("/products/getAllProducts");

    set({
      products: res.data,
      loading: false,
    });
  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to fetch products",
    });
  }
};

export const getProductById = async (set, productId) => {
  try {
    set({
      loading: true,
      error: null,
    });

    const res = await api.get(
      `/products/getProduct/${productId}`
    );

    set({
      selectedProduct: res.data.data,
      loading: false,
    });

  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to fetch product",
    });
  }
};
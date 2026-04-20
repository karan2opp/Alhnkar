import api from "../utils/axios.js"

// product.service.js

export const getAllProducts = async (
  set,
  filters = {}
) => {
  try {
    set({
      loading: true,
      error: null,
    });

    const query = new URLSearchParams();

    // if category exists, prioritize category filter
    if (filters.category) {
      query.append(
        "category",
        filters.category
      );
    } else if (filters.title) {
      // only use title when category is not present
      query.append(
        "title",
        filters.title
      );
    }

    const res = await api.get(
      `/products/getAllProducts?${query.toString()}`
    );


    set({
      products: res.data.data.products,
      loading: false,
    });
  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to fetch products",
    });

    console.log(error);
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
import api from "../utils/axios.js"

// product.service.js

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

    if (filters.category) {
      query.append(
        "category",
        filters.category
      );
    }

    if (filters.title) {
      query.append(
        "title",
        filters.title
      );
    }

    if (filters.page) {
      query.append(
        "page",
        filters.page
      );
    }

    if (filters.limit) {
      query.append(
        "limit",
        filters.limit
      );
    }

    const res = await api.get(
      `/products/getAllProducts?${query.toString()}`
    );

    set((state) => ({
      products:
        filters.page && filters.page > 1
          ? [
              ...state.products,
              ...res.data.data.products,
            ]
          : res.data.data.products,

      loading: false,
    }));
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
// src/cart/cart.service.js

import api from "../utils/axios.js";

/*
  Fetch cart of logged-in user
*/
export const fetchCart = async (set) => {
  try {
    set({
      loading: true,
      error: null,
    });

    const res = await api.get("/cart");

    /*
      Expected backend response:

      {
        success: true,
        data: [...]
      }
    */

    set({
      cartItems: res.data.data,
      loading: false,
    });
  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to fetch cart",
    });
  }
};

/*
  Add product to cart
*/
export const addToCart = async (set, payload) => {
  try {
    set({
      loading: true,
      error: null,
    });

    await api.post("/cart/addToCart", payload);

    /*
      After adding,
      refetch cart for fresh UI
    */
    await fetchCart(set);
  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to add to cart",
    });
  }
};

/*
  Remove product from cart
*/
export const removeFromCart = async (set, cartItemId) => {
  try {
    set({
      loading: true,
      error: null,
    });

    await api.delete(`/cart/updateCart/${cartItemId}`);

    /*
      Refresh cart again
    */
    await fetchCart(set);
  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to remove item",
    });
  }
};
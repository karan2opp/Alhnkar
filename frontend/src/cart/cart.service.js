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

    const res = await api.get("/cart/getCart");
  
  
    /*
      Expected backend response:

      {
        success: true,
        data: [...]
      }
    */
  
   

    set({
      cartItems: res.data.data.items,
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


export const updateCart = async (
  set,
  payload
) => {
  try {
    set({
      loading: true,
      error: null,
    });

    await api.post(
      "/cart/updateCart",
      payload
    );

    await fetchCart(set);
  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to update cart",
    });
  }
};
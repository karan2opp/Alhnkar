// src/store/useCartStore.js

import { create } from "zustand";
import {
  addToCart,
  updateCart,
  fetchCart,
} from "../cart/cart.service";

export const useCartStore = create((set) => ({
  cartItems: [],
  loading: false,
  error: null,

  /*
    Fetch full cart of logged-in user
  */
  fetchUserCart: () => fetchCart(set),

  /*
    Add product to cart

    payload example:
    {
      productId: "abc123",
      quantity: 1,
      size: "M"
    }
  */
  addProductToCart: (payload) => addToCart(set, payload),

updateCartItem: (payload) =>
  updateCart(set, payload),

  /*
    Clear local cart state on logout
  */
  clearCart: () =>
    set({
      cartItems: [],
      loading: false,
      error: null,
    }),
}));
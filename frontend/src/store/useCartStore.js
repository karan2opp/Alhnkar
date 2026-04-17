// src/store/useCartStore.js

import { create } from "zustand";
import {
  addToCart,
  removeFromCart,
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

  /*
    Remove item from cart

    example:
    cartItemId
  */
  removeProductFromCart: (cartItemId) =>
    removeFromCart(set, cartItemId),

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
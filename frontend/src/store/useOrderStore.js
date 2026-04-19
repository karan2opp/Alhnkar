import { create } from "zustand";
import {
  createOrder,
  fetchOrders,
  cancelOrder,
} from "../order/order.service";

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,

  /*
    Place order
  */
  placeUserOrder: (payload) =>
    createOrder(set, payload),

  /*
    Fetch all user orders
  */
 fetchUserOrders: (action) =>
  fetchOrders(set, action),

  /*
    Cancel user order
  */
  cancelUserOrder: (orderId) =>
    cancelOrder(set, orderId),

  /*
    Clear orders on logout
  */
  clearOrders: () =>
    set({
      orders: [],
      loading: false,
      error: null,
    }),
}));
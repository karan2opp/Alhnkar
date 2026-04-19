// src/order/order.service.js

import api from "../utils/axios";

/*
  Create Order
*/
export const createOrder = async (set, payload) => {
  try {
    set({
      loading: true,
      error: null,
    });

    const res = await api.post(
      "/orders/createOrder",
      payload
    );

    console.log(res);

    set({
      loading: false,
    });

    return res.data.data;
  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to place order",
    });
  }
};

/*
  Fetch User Orders

  action values:
  - pending
  - canceled
  - delivered
  - allOrders
*/
export const fetchOrders = async (
  set,
  action = "allOrders"
) => {
  try {
    set({
      loading: true,
      error: null,
    });

    const res = await api.get(
      `/orders/getOrders?status=${action}`
    );
    console.log(action);
    
  console.log(res);
  
    set({
      orders: res.data.data,
      loading: false,
    });

    return res.data.data;
  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to fetch orders",
    });
  }
};

/*
  Cancel Order
*/
export const cancelOrder = async (
  set,
  orderId
) => {
  try {
    set({
      loading: true,
      error: null,
    });

    await api.patch(
      `/orders/cancelOrder/${orderId}`
    );

    /*
      After cancel,
      refresh all orders
    */
    await fetchOrders(
      set,
      "allOrders"
    );
  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to cancel order",
    });
  }
};
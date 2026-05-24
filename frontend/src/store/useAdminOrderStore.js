import { create } from "zustand";

import {
  fetchAllAdminOrders,
  updateOrderStatus,
  getOrderDetails,
} from "../admin/adminOrder.service.js";

export const useAdminOrderStore = create((set) => ({
  // ── State ─────────────────────────────────────────────
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,

  // ── Actions: Read ────────────────────────────────────
  fetchAdminOrders: (filters) => fetchAllAdminOrders(set, filters),
  fetchOrderDetails: (orderId) => getOrderDetails(set, orderId),

  // ── Actions: Write ───────────────────────────────────
  updateOrderStatus: (orderId, status) =>
    updateOrderStatus(set, orderId, status),

  // ── Helpers ──────────────────────────────────────────
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  clearError: () => set({ error: null }),
  clearOrders: () => set({ orders: [], selectedOrder: null }),
}));
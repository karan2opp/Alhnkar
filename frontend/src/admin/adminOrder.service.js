import api from "../utils/axios.js";

/**
 * Fetch All Admin Orders (with optional status filter)
 */
import { useAuthStore } from "../store/useAuthStore.js"; // ← Add this import

export const fetchAllAdminOrders = async (set, filters = {}) => {
  try {
    // 🔍 DEBUG: Check auth state BEFORE request
    const authState = useAuthStore.getState();
    const token = authState.accessToken;
    
    console.log("🔐 [fetchAllAdminOrders] Auth check:", {
      hasToken: !!token,
      tokenPreview: token ? token.slice(0, 30) + "..." : null,
      user: authState.user?.email || authState.user?.name,
      isAdmin: authState.user?.role === "admin"
    });

    // ⚠️ Warn if no token (but continue — axios interceptor may handle it)
    if (!token) {
      console.warn("⚠️ No accessToken in useAuthStore — request may fail with 401");
    }

    set({ loading: true, error: null });

    const query = new URLSearchParams();
    
    const statusMap = {
      all: "",
      pending: "pending",
      confirmed: "pending",
      delivered: "delivered",
      cancelled: "cancelled",
    };
    
   // ✅ This correctly skips appending when status is ""
if (filters.status) {
  const mappedStatus = statusMap[filters.status];
  if (mappedStatus) {  // 👈 only append if not empty string
    query.append("status", mappedStatus);
  }
}
    if (filters.page) query.append("page", filters.page);
    if (filters.limit) query.append("limit", filters.limit);

    const url = `/orders/admin/getAllOrders?${query.toString()}`;

    const res = await api.get(url);

    console.log("📦 fetchAllAdminOrders response:", res.data);

    const extractOrders = (data) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.orders)) return data.orders;
      if (Array.isArray(data?.data?.orders)) return data.data.orders;
      if (Array.isArray(data?.data?.data)) return data.data.data;
      return [];
    };

    const ordersArray = extractOrders(res.data);

    set({
      orders: ordersArray,
      loading: false,
    });

    return ordersArray;

  } catch (error) {
  console.log(error);
  
    set({
      loading: false,
      error: error.response?.data?.message || "Failed to fetch orders",
    });
    
    throw error;
  }
};

/**
 * Update Order Status (Admin)
 */
export const updateOrderStatus = async (set, orderId, status) => {
  try {
    set({ loading: true, error: null });

    const validStatuses = ["pending", "delivered", "cancelled"];
    const backendStatus = validStatuses.includes(status) ? status : "pending";

    const res = await api.patch(`/orders/updateOrder/${orderId}`, {
      status: backendStatus,
    });

    // Update the order in local state
    set((state) => ({
      orders: Array.isArray(state.orders) 
        ? state.orders.map((o) =>
            (o._id || o.id) === orderId ? { ...o, status: backendStatus } : o
          )
        : [],
      selectedOrder:
        state.selectedOrder && (state.selectedOrder._id || state.selectedOrder.id) === orderId
          ? { ...state.selectedOrder, status: backendStatus }
          : state.selectedOrder,
      loading: false,
    }));

    return res.data.data;
  } catch (error) {
    set({
      loading: false,
      error: error.response?.data?.message || "Failed to update order status",
    });
    console.error("updateOrderStatus error:", error);
    throw error;
  }
};

/**
 * Get Order Details by ID (Admin)
 */
export const getOrderDetails = async (set, orderId) => {
  try {
    set({ loading: true, error: null });

    const res = await api.get(`/orders/getOrder/${orderId}`);

    set({
      selectedOrder: res.data?.data || res.data || null,
      loading: false,
    });

    return res.data?.data || res.data || null;
  } catch (error) {
    set({
      loading: false,
      error: error.response?.data?.message || "Failed to fetch order details",
    });
    console.error("getOrderDetails error:", error);
    throw error;
  }
};
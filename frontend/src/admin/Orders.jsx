import React, { useState, useEffect } from "react";
import { useAdminOrderStore } from "../store/useAdminOrderStore.js";
import { Icon, StatusBadge, InfoBlock, Row } from "./SharedComponent";

// ── Helper: Get order ID (handles _id or id) ───────────────────────
const getOrderId = (order) => order?._id || order?.id;

// ── Helper: Extract category name for display ──────────────────────
const getCategoryName = (category) => {
  if (!category) return "-";
  if (typeof category === "object") return category.name || category.title || category._id || "-";
  return category;
};

// ── Order Detail Page (Connected) ──────────────────────────────────
export function OrderDetailPage({ order: initialOrder, onBack }) {
  const { selectedOrder, fetchOrderDetails, updateOrderStatus, loading, error } = useAdminOrderStore();
  
  // Use selectedOrder from store if available, else fallback to prop
  const order = selectedOrder || initialOrder;
  const [status, setStatus] = useState(order?.status || "pending");

  // Fetch fresh order details on mount
  useEffect(() => {
    if (order?._id || order?.id) {
      fetchOrderDetails(getOrderId(order));
    }
  }, [order?._id || order?.id]);

  // Sync local status with order status when order changes
  useEffect(() => {
    if (order?.status) setStatus(order.status);
  }, [order?.status]);

  if (!order) return <div className="p-6 text-[var(--color-muted)]">Loading order...</div>;

  const orderId = getOrderId(order);
  const subtotal = order.items?.reduce((a, i) => a + (i.price || 0) * (i.quantity || 1), 0) || 0;

  const handleStatusUpdate = async () => {
    try {
      await updateOrderStatus(orderId, status);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 mb-5 px-3.5 py-1.75 rounded-lg text-[13px] border border-[var(--color-border-theme)] bg-transparent text-[var(--color-muted)] cursor-pointer hover:opacity-80 transition">
        <Icon name="back" size={14} color="var(--color-muted)" /> Back to orders
      </button>

      {error && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-[#fef2f2] text-[#7f1d1d] text-[13px]">
          {error}
        </div>
      )}

      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="text-[20px] font-medium text-[var(--color-text)] font-serif">
            Order #{order._id?.slice(-6) || order.id || orderId}
          </div>
          <div className="text-[12px] text-[var(--color-muted)] mt-1">
            Placed on {order.createdAt?.slice(0, 10) || order.date || "-"}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <StatusBadge status={status} />
          <select 
            value={status} 
            onChange={e => setStatus(e.target.value)} 
            className="px-3 py-1.75 rounded-lg text-[12px] border border-[var(--color-border-theme)] bg-[var(--color-bg)] text-[var(--color-text)] cursor-pointer outline-none"
            disabled={loading}
          >
            {["pending", "confirmed", "delivered", "cancelled"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button 
            onClick={handleStatusUpdate}
            disabled={loading || status === order.status}
            className={`px-4 py-1.75 rounded-lg text-[12px] border-none cursor-pointer font-medium transition ${
              loading || status === order.status
                ? "bg-[var(--color-muted)] text-white/60 cursor-not-allowed"
                : "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
            }`}
          >
            {loading ? "Updating..." : "Update status"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3.5 mb-5">
        <InfoBlock icon="user" label="Customer">
          <Row label="Name" value={order.customer?.name || order.customer || "-"} />
          <Row label="Email" value={order.customer?.email || order.email || "-"} />
          <Row label="Phone" value={order.customer?.phone || order.phone || "-"} />
        </InfoBlock>
        <InfoBlock icon="map" label="Delivery address">
          <Row label="Street" value={order.deliveryAddress?.street || order.shippingAddress?.street || "-"} />
          <Row label="City" value={order.deliveryAddress?.city || order.shippingAddress?.city || "-"} />
          <Row label="State" value={order.deliveryAddress?.state || order.shippingAddress?.state || "-"} />
          <Row label="Pincode" value={order.deliveryAddress?.pincode || order.shippingAddress?.pincode || "-"} />
        </InfoBlock>
        <InfoBlock icon="payment" label="Payment">
          <Row label="Method" value={(order.paymentMethod || "upi").toUpperCase()} />
          <Row label="Status" value={order.paymentStatus === "paid" ? "completed" : order.paymentStatus || "pending"} />
          <Row label="Subtotal" value={`₹${subtotal.toLocaleString()}`} />
          <Row label="Delivery" value="Free" />
          <div className="flex justify-between py-2 mt-0.5">
            <span className="text-[13px] font-medium text-[var(--color-text)]">Total</span>
            <span className="text-[15px] font-medium text-[var(--color-accent)] font-serif">
              ₹{(order.totalAmount || order.amount || subtotal).toLocaleString()}
            </span>
          </div>
        </InfoBlock>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[var(--color-border-theme)] flex items-center gap-2 text-[11px] font-medium text-[var(--color-text)] uppercase tracking-wider">
          <Icon name="pkg" size={14} color="var(--color-gold)" /> Order items ({order.items?.length || 0})
        </div>
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="bg-[var(--color-bg)]">
              {["Product", "Category", "Size", "Qty", "Unit Price", "Total"].map(h => (
                <th key={h} className="px-5 py-2.75 text-left text-[11px] font-medium text-[var(--color-muted)] uppercase tracking-wide border-b border-[var(--color-border-theme)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item, i) => {
              const product = item.product || item;
              const price = item.price || product.price || 0;
              const quantity = item.quantity || 1;
              return (
                <tr key={item._id || item.id || i} className={i % 2 === 0 ? "bg-[var(--color-surface)]" : "bg-[var(--color-stripe)]"}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-[var(--color-pri-light)] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="pkg" size={14} color="var(--color-accent)" />
                      </div>
                      <span className="text-[13px] font-medium text-[var(--color-text)]">
                        {product.title || product.name || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[var(--color-muted)]">
                    {getCategoryName(product.category)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="bg-[var(--color-gold-light)] text-[#7a4f00] text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                      {item.size || product.size || "-"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[var(--color-text)]">{quantity}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[var(--color-text)]">₹{price.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[var(--color-text)]">
                    ₹{(price * quantity).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-5 py-3.5 border-t border-[var(--color-border-theme)] flex justify-end">
          <div className="bg-[var(--color-bg)] rounded-xl p-3 flex gap-8 items-center">
            <div className="text-right">
              <div className="text-[11px] text-[var(--color-muted)] mb-0.5">Subtotal</div>
              <div className="text-[14px] font-medium text-[var(--color-text)]">₹{subtotal.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[var(--color-muted)] mb-0.5">Delivery</div>
              <div className="text-[14px] font-medium text-[#1b5e20]">Free</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[var(--color-muted)] mb-0.5">Grand total</div>
              <div className="text-[20px] font-medium text-[var(--color-accent)] font-serif">
                ₹{(order.totalAmount || order.amount || subtotal).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Orders List Page (Connected to Backend) ────────────────────────
export default function OrdersPage({ filter = "all", onOrderClick }) {
  const { orders, loading, error, fetchAdminOrders, setSelectedOrder } = useAdminOrderStore();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    ["pending", "delivered", "cancelled"].includes(filter) ? filter : "all"
  );

  // Fetch orders when filter changes
  useEffect(() => {
    fetchAdminOrders({ status: statusFilter });
  }, [statusFilter]);

  // Local search filter (applied after backend fetch)
  const filtered = (orders || []).filter(o => {
    const matchSearch = 
      (o.customer?.name || o.customer || "").toLowerCase().includes(search.toLowerCase()) ||
      (o._id || o.id || "").includes(search);
    return matchSearch;
  });

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    onOrderClick?.(order);
  };

  return (
    <div>
      <div className="flex gap-2.5 mb-4.5 flex-wrap">
        <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <Icon name="search" size={14} color="var(--color-muted)" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by customer name or order ID..."
            className="border-none outline-none bg-transparent text-[13px] text-[var(--color-text)] w-full placeholder-[var(--color-muted)]"
          />
        </div>
        {["all", "pending", "confirmed", "delivered", "cancelled"].map(s => (
          <button 
            key={s} 
            onClick={() => setStatusFilter(s)} 
            className={`px-4 py-2 rounded-lg text-[12px] cursor-pointer border transition ${
              statusFilter === s 
                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white font-medium" 
                : "border-[var(--color-border-theme)] bg-transparent text-[var(--color-muted)] font-normal hover:border-[var(--color-accent)]"
            }`}
          >
            {s === "all" ? "All orders" : s}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-[#fef2f2] text-[#7f1d1d] text-[13px]">
          {error}
        </div>
      )}

      {loading && orders.length === 0 ? (
        <div className="text-center py-10 text-[var(--color-muted)]">Loading orders...</div>
      ) : (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-xl overflow-hidden">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-[var(--color-bg)]">
                {["Order ID", "Customer", "Items", "Amount", "Date", "Status", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-medium text-[var(--color-muted)] uppercase tracking-wide border-b border-[var(--color-border-theme)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => {
                const orderId = getOrderId(o);
                const customerName = o.customer?.name || o.customer || "-";
                const itemCount = o.items?.length || 0;
                const amount = o.totalAmount || o.amount || 0;
                const orderDate = o.createdAt?.slice(0, 10) || o.date || "-";
                
                return (
                  <tr 
                    key={orderId} 
                    onClick={() => handleOrderClick(o)}
                    className={`${i % 2 === 0 ? "bg-[var(--color-surface)]" : "bg-[var(--color-stripe)]"} cursor-pointer hover:bg-[var(--color-gold-light)]/30 transition`}
                  >
                    <td className="px-4 py-3 text-[12px] font-medium text-[var(--color-accent)]">
                      #{orderId?.slice(-6) || "-"}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[var(--color-text)]">{customerName}</td>
                    <td className="px-4 py-3 text-[13px] text-[var(--color-muted)]">{itemCount}</td>
                    <td className="px-4 py-3 text-[13px] font-medium text-[var(--color-text)]">₹{amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[12px] text-[var(--color-muted)]">{orderDate}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={e => { e.stopPropagation(); handleOrderClick(o); }} 
                        className="px-3 py-1.25 rounded-md text-[11px] border border-[var(--color-border-theme)] bg-transparent text-[var(--color-accent)] cursor-pointer font-medium hover:bg-[var(--color-pri-light)] transition"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <div className="text-center py-10 text-[var(--color-muted)] text-[13px]">
              No orders found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
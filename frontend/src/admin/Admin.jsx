import React, { useState, useEffect } from "react"
import { useAdminOrderStore } from "../store/useAdminOrderStore.js"
import { Icon, MetricCard, StatusBadge } from "./SharedComponent"
import ProductsPage from "./Products"
import OrdersPage, { OrderDetailPage } from "./Orders"
import { useAuthStore } from "../store/useAuthStore.js"

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "products", label: "Products", icon: "box" },
  { id: "orders", label: "All Orders", icon: "list" },

]

const getOrderId = (order) => order?._id || order?.id
const getCustomerName = (order) => order?.user?.name || order?.customer?.name || order?.customer || "-"
const getOrderAmount = (order) => order?.totalAmount || order?.amount || 0
const getOrderDate = (order) => {
  if (order?.createdAt) return new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  return order?.date || "-"
}

function Dashboard({ onOrderClick }) {
  const { orders, loading } = useAdminOrderStore()

  const barData = [18400, 22100, 15800, 28900, 21300, 24580, 19700]
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const max = Math.max(...barData)

  const ordersArray = Array.isArray(orders) ? orders : []
  const totalOrders = ordersArray.length
  const pendingCount = ordersArray.filter(o => o.status === "pending").length
  const deliveredCount = ordersArray.filter(o => o.status === "delivered").length
  const cancelledCount = ordersArray.filter(o => o.status === "cancelled").length
  const recentOrders = ordersArray.slice(0, 4)

  return (
    <div>
      <div className="grid grid-cols-3 gap-3.5 mb-5">
        <MetricCard label="Total Products" value="128" icon="box" sub="14 categories" />
        <MetricCard label="All Orders" value={loading ? "..." : totalOrders} icon="list" sub="+8 today" subColor="#2e7d32" />
        <MetricCard label="Pending" value={loading ? "..." : pendingCount} icon="clock" sub="needs attention" subColor="var(--color-accent)" />
        <MetricCard label="Delivered" value={loading ? "..." : deliveredCount} icon="check" sub="72% completion" subColor="#2e7d32" />
        <MetricCard label="Cancelled" value={loading ? "..." : cancelledCount} icon="x" sub="5.9% rate" subColor="var(--color-accent)" />
        <MetricCard label="Today's Revenue" value="₹24,580" icon="revenue" sub="+12% vs yesterday" subColor="#2e7d32" />
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-xl p-4.5 mb-5">
        <div className="text-[13px] font-medium text-[var(--color-text)] mb-4">Revenue — last 7 days</div>
        <div className="flex items-end gap-2 h-25">
          {barData.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full rounded-t-sm transition-opacity ${i === 5 ? "bg-[var(--color-gold)] opacity-100" : "bg-[var(--color-accent)] opacity-75"}`} style={{ height: Math.round((v / max) * 90) }} />
              <span className="text-[10px] text-[var(--color-muted)]">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders only — top products removed */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-xl p-4.5">
        <div className="text-[13px] font-medium text-[var(--color-text)] mb-3.5">Recent orders</div>
        {loading ? (
          <div className="text-[13px] text-[var(--color-muted)] py-4">Loading...</div>
        ) : recentOrders.length > 0 ? (
          recentOrders.map(o => (
            <div key={getOrderId(o)} onClick={() => onOrderClick(o)} className="flex justify-between items-center py-2.25 border-b border-[var(--color-border-theme)] cursor-pointer hover:bg-[var(--color-bg)] rounded transition">
              <div>
                <div className="text-[12px] font-medium text-[var(--color-accent)]">#{getOrderId(o)?.slice(-6)}</div>
                <div className="text-[11px] text-[var(--color-muted)]">{getCustomerName(o)}</div>
              </div>
              <div className="text-right">
                <StatusBadge status={o.status} />
                <div className="text-[12px] font-medium text-[var(--color-text)] mt-0.75">₹{getOrderAmount(o).toLocaleString()}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-[13px] text-[var(--color-muted)] py-4">No recent orders</div>
        )}
      </div>
    </div>
  )
}

export default function Admin() {
  const [page, setPage] = useState("dashboard")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { fetchAdminOrders } = useAdminOrderStore()
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    if (accessToken) {
      fetchAdminOrders({ status: "all" })
    }
  }, [accessToken, fetchAdminOrders])

  const handleOrderClick = (order) => {
    setSelectedOrder(order)
    setPage("orderDetail")
  }

  const handleBackFromOrder = () => {
    setSelectedOrder(null)
    setPage("orders")
  }

  const pageTitle = {
    dashboard: "Dashboard", products: "Products",
    orders: "All Orders", pending: "Pending Orders",
    delivered: "Delivered Orders", cancelled: "Cancelled Orders",
    orderDetail: selectedOrder ? `Order #${getOrderId(selectedOrder)?.slice(-6)}` : "Order Detail"
  }

  return (
    <div className="flex h-screen bg-[var(--color-bg)] font-sans">
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500&family=Georgia&display=swap" rel="stylesheet" />

      <div className="w-55 bg-[var(--color-sidebar)] flex flex-col flex-shrink-0">
        <div className="p-5.5 border-b border-white/10">
          <div className="text-[20px] font-medium text-[var(--color-gold)] font-serif tracking-wide">alhnkar</div>
          <div className="text-[11px] text-white/35 mt-0.75 tracking-widest uppercase">admin panel</div>
        </div>
        <div className="p-2.5 flex-1">
          {SIDEBAR_ITEMS.map(item => (
            <div key={item.id} onClick={() => { setPage(item.id); setSelectedOrder(null) }} className={`flex items-center gap-2.5 px-4.5 py-2.75 text-[13px] cursor-pointer transition-all duration-150 ${(page === item.id || (page === "orderDetail" && item.id === "orders")) ? "text-[var(--color-gold)] bg-[var(--color-gold)]/10 border-l-2 border-[var(--color-gold)]" : "text-white/55 border-l-2 border-transparent hover:text-white/80 hover:bg-white/5"}`}>
              <Icon name={item.icon} size={15} color={(page === item.id || (page === "orderDetail" && item.id === "orders")) ? "var(--color-gold)" : "rgba(255,255,255,0.4)"} />
              {item.label}
            </div>
          ))}
        </div>
        <div className="p-3.5 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7.5 h-7.5 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[11px] font-medium text-white flex-shrink-0">AD</div>
            <div>
              <div className="text-[12px] text-white/80 font-medium">Admin</div>
              <div className="text-[10px] text-white/35">admin@alhnkar.com</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-theme)] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {page === "orderDetail" && (
              <button onClick={handleBackFromOrder} className="flex items-center bg-transparent border-none cursor-pointer p-0 mr-1 hover:opacity-80 transition">
                <Icon name="back" size={16} color="var(--color-muted)" />
              </button>
            )}
            <div className="text-[15px] font-medium text-[var(--color-text)]">{pageTitle[page]}</div>
          </div>
          <div className="text-[12px] text-[var(--color-muted)]">
            {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {page === "dashboard" && <Dashboard onOrderClick={handleOrderClick} />}
          {page === "products" && <ProductsPage />}
          {page === "orderDetail" && selectedOrder && <OrderDetailPage order={selectedOrder} onBack={handleBackFromOrder} />}
          {(page === "orders" || page === "pending" || page === "delivered" || page === "cancelled") && (
            <OrdersPage filter={page} onOrderClick={handleOrderClick} />
          )}
        </div>
      </div>
    </div>
  )
}
import React, { useState, useEffect } from "react"
import { useAdminOrderStore } from "../store/useAdminOrderStore.js"
import { useAdminProductStore } from "../store/useAdminProductStore.js"
import { Icon, MetricCard, StatusBadge } from "./SharedComponent"
import ProductsPage from "./Products"
import OrdersPage, { OrderDetailPage } from "./Orders"
import { useAuthStore } from "../store/useAuthStore.js"
import CategoryPage from "./CategoryPage"
const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "products", label: "Products", icon: "box" },
  { id: "categories", label: "Categories", icon: "list" }, // ✅ Add this
  { id: "orders", label: "All Orders", icon: "list" },
]

// ── Helper Functions ───────────────────────────────────────────────
const getOrderId = (order) => order?._id || order?.id
const getCustomerName = (order) => order?.user?.name || order?.customer?.name || order?.customer || "-"
const getOrderAmount = (order) => order?.totalAmount || order?.amount || 0

// ✅ Calculate today's revenue (kept for metric card)
const calculateTodayRevenue = (orders) => {
  const today = new Date().toISOString().split("T")[0]
  return orders
    .filter(o => {
      if (!o?.createdAt) return false
      const orderDate = new Date(o.createdAt).toISOString().split("T")[0]
      return orderDate === today && o.status !== "cancelled"
    })
    .reduce((sum, o) => sum + (o.totalAmount || o.amount || 0), 0)
}

// ── Dashboard Component ─────────────────────────────────────────────
function Dashboard({ onOrderClick }) {
  const { orders, loading: ordersLoading, error: ordersError } = useAdminOrderStore()
  const { products, loading: productsLoading, error: productsError } = useAdminProductStore()

  const ordersArray = Array.isArray(orders) ? orders : []
  const productsArray = Array.isArray(products) ? products : []

  // ✅ Real metrics from data
  const totalOrders = ordersArray.length
  const pendingCount = ordersArray.filter(o => o.status === "pending").length
  const deliveredCount = ordersArray.filter(o => o.status === "delivered").length
  const cancelledCount = ordersArray.filter(o => o.status === "cancelled").length
  const totalProducts = productsArray.length
  
  const todayRevenue = calculateTodayRevenue(ordersArray)
  
  const recentOrders = ordersArray
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4)

  const isLoading = ordersLoading || productsLoading
  const errorMessage = productsError || ordersError

  return (
    <div>
      {/* Error Display */}
      {errorMessage && (
        <div className="bg-[#fdecea] border border-[var(--color-accent)] text-[var(--color-accent)] text-[12px] rounded-lg p-3 mb-5">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Metric Cards - Real Data */}
      <div className="grid grid-cols-3 gap-3.5 mb-5">
        <MetricCard 
          label="Total Products" 
          value={isLoading ? "..." : totalProducts} 
          icon="box" 
          sub={`${productsArray.filter(p => p.category).length} categories`} 
        />
        <MetricCard 
          label="All Orders" 
          value={isLoading ? "..." : totalOrders} 
          icon="list" 
          sub={`+${ordersArray.filter(o => {
            const today = new Date().toISOString().split("T")[0]
            return new Date(o.createdAt).toISOString().split("T")[0] === today
          }).length} today`} 
          subColor="#2e7d32" 
        />
        <MetricCard 
          label="Pending" 
          value={isLoading ? "..." : pendingCount} 
          icon="clock" 
          sub="needs attention" 
          subColor="var(--color-accent)" 
        />
        <MetricCard 
          label="Delivered" 
          value={isLoading ? "..." : deliveredCount} 
          icon="check" 
          sub={`${totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0}% completion`} 
          subColor="#2e7d32" 
        />
        <MetricCard 
          label="Cancelled" 
          value={isLoading ? "..." : cancelledCount} 
          icon="x" 
          sub={`${totalOrders > 0 ? ((cancelledCount / totalOrders) * 100).toFixed(1) : 0}% rate`} 
          subColor="var(--color-accent)" 
        />
        <MetricCard 
          label="Today's Revenue" 
          value={isLoading ? "..." : `₹${todayRevenue.toLocaleString()}`} 
          icon="revenue" 
          sub="+12% vs yesterday" 
          subColor="#2e7d32" 
        />
      </div>

      {/* Recent Orders - Real Data */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-xl p-4.5">
        <div className="text-[13px] font-medium text-[var(--color-text)] mb-3.5">Recent orders</div>
        {isLoading ? (
          <div className="text-[13px] text-[var(--color-muted)] py-4">Loading orders...</div>
        ) : recentOrders.length > 0 ? (
          recentOrders.map(o => (
            <div 
              key={getOrderId(o)} 
              onClick={() => onOrderClick(o)} 
              className="flex justify-between items-center py-2.25 border-b border-[var(--color-border-theme)] cursor-pointer hover:bg-[var(--color-bg)] rounded transition"
            >
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

// ── Main Admin Component ────────────────────────────────────────────
export default function Admin() {
  const [page, setPage] = useState("dashboard")
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  const { fetchAdminOrders } = useAdminOrderStore()
  const { fetchProducts } = useAdminProductStore()
  const accessToken = useAuthStore((state) => state.accessToken)

  // ✅ Fetch data on mount
  useEffect(() => {
    if (accessToken) {
      fetchAdminOrders({ status: "all" })
      fetchProducts()
    }
  }, [accessToken, fetchAdminOrders, fetchProducts])

  const handleOrderClick = (order) => {
    setSelectedOrder(order)
    setPage("orderDetail")
  }

  const handleBackFromOrder = () => {
    setSelectedOrder(null)
    setPage("orders")
  }

  const pageTitle = {
    dashboard: "Dashboard", 
    products: "Products",
    orders: "All Orders", 
    pending: "Pending Orders",
    delivered: "Delivered Orders", 
    cancelled: "Cancelled Orders",
    orderDetail: selectedOrder ? `Order #${getOrderId(selectedOrder)?.slice(-6)}` : "Order Detail"
  }

  return (
    <div className="flex h-screen bg-[var(--color-bg)] font-sans">
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500&family=Georgia&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <div className="w-55 bg-[var(--color-sidebar)] flex flex-col flex-shrink-0">
        <div className="p-5.5 border-b border-white/10">
          <div className="text-[20px] font-medium text-[var(--color-gold)] font-serif tracking-wide">alhnkar</div>
          <div className="text-[11px] text-white/35 mt-0.75 tracking-widest uppercase">admin panel</div>
        </div>
        <div className="p-2.5 flex-1">
          {SIDEBAR_ITEMS.map(item => (
            <div 
              key={item.id} 
              onClick={() => { setPage(item.id); setSelectedOrder(null) }} 
              className={`flex items-center gap-2.5 px-4.5 py-2.75 text-[13px] cursor-pointer transition-all duration-150 ${
                (page === item.id || (page === "orderDetail" && item.id === "orders")) 
                  ? "text-[var(--color-gold)] bg-[var(--color-gold)]/10 border-l-2 border-[var(--color-gold)]" 
                  : "text-white/55 border-l-2 border-transparent hover:text-white/80 hover:bg-white/5"
              }`}
            >
              <Icon 
                name={item.icon} 
                size={15} 
                color={(page === item.id || (page === "orderDetail" && item.id === "orders")) ? "var(--color-gold)" : "rgba(255,255,255,0.4)"} 
              />
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

      {/* Main Content */}
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
  {page === "categories" && <CategoryPage />} {/* ✅ Add this */}
  {page === "orderDetail" && selectedOrder && <OrderDetailPage order={selectedOrder} onBack={handleBackFromOrder} />}
  {(page === "orders" || page === "pending" || page === "delivered" || page === "cancelled") && (
    <OrdersPage filter={page} onOrderClick={handleOrderClick} />
  )}
</div>
      </div>
    </div>
  )
}
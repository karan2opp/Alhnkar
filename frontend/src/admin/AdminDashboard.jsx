import { useState } from "react"
import { useAdminOrderStore } from "../store/useAdminOrderStore"
import { Icon, StatusBadge } from "./SharedComponent"

// ── Field helpers (backend uses _id, user.name, totalAmount, etc.) ──
const getId     = (o) => o?._id || o?.id || ""
const getName   = (o) => o?.user?.name || o?.customer?.name || o?.customer || "-"
const getEmail  = (o) => o?.user?.email || o?.email || "-"
const getPhone  = (o) => o?.user?.phone || o?.phone || "-"
const getAmount = (o) => o?.totalAmount || o?.amount || 0
const getDate   = (o) => {
  if (o?.createdAt) return new Date(o.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  return o?.date || "-"
}
const getAddress = (o) => o?.address || o?.deliveryAddress || {}
const getItems   = (o) => o?.items || []

// item-level helpers (populated: items.product has title, images, price)
const getItemTitle    = (item) => item?.product?.title || item?.title || "-"
const getItemCategory = (item) => item?.product?.category || item?.category || "-"
const getItemPrice    = (item) => item?.product?.price || item?.price || 0

// ── InfoBlock & Row (local, only used here) ──────────────────────────
const InfoBlock = ({ icon, label, children }) => (
  <div className="bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-xl p-4">
    <div className="flex items-center gap-2 mb-3">
      <Icon name={icon} size={14} color="var(--color-gold)" />
      <span className="text-[11px] font-medium text-[var(--color-text)] uppercase tracking-wider">{label}</span>
    </div>
    {children}
  </div>
)

const Row = ({ label, value }) => (
  <div className="flex justify-between py-1.5 border-b border-[var(--color-border-theme)]">
    <span className="text-[12px] text-[var(--color-muted)]">{label}</span>
    <span className="text-[12px] font-medium text-[var(--color-text)]">{value}</span>
  </div>
)

// ── Order Detail ─────────────────────────────────────────────────────
export const OrderDetailPage = ({ order, onBack }) => {
  const { updateAdminOrderStatus } = useAdminOrderStore()
  const [status, setStatus] = useState(order.status)
  const [updating, setUpdating] = useState(false)

  const items   = getItems(order)
  const addr    = getAddress(order)
  const subtotal = items.reduce((a, item) => a + getItemPrice(item) * (item.quantity || 1), 0)

  const handleUpdateStatus = async () => {
    setUpdating(true)
    await updateAdminOrderStatus(getId(order), status)
    setUpdating(false)
  }

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 mb-5 px-3.5 py-1.75 rounded-lg text-[13px] border border-[var(--color-border-theme)] bg-transparent text-[var(--color-muted)] cursor-pointer hover:opacity-80 transition">
        <Icon name="back" size={14} color="var(--color-muted)" /> Back to orders
      </button>

      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="text-[20px] font-medium text-[var(--color-text)] font-serif">
            Order #{getId(order).slice(-6)}
          </div>
          <div className="text-[12px] text-[var(--color-muted)] mt-1">Placed on {getDate(order)}</div>
        </div>
        <div className="flex items-center gap-2.5">
          <StatusBadge status={status} />
          <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-1.75 rounded-lg text-[12px] border border-[var(--color-border-theme)] bg-[var(--color-bg)] text-[var(--color-text)] cursor-pointer outline-none">
            {["pending", "confirmed", "delivered", "cancelled"].map(s => <option key={s}>{s}</option>)}
          </select>
          <button
            onClick={handleUpdateStatus}
            disabled={updating}
            className="px-4 py-1.75 rounded-lg text-[12px] border-none bg-[var(--color-accent)] text-white cursor-pointer font-medium hover:bg-[var(--color-accent-dark)] transition disabled:opacity-60"
          >
            {updating ? "Updating..." : "Update status"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3.5 mb-5">
        <InfoBlock icon="user" label="Customer">
          <Row label="Name"  value={getName(order)} />
          <Row label="Email" value={getEmail(order)} />
          <Row label="Phone" value={getPhone(order)} />
        </InfoBlock>
        <InfoBlock icon="map" label="Delivery address">
          <Row label="Street"  value={addr.street  || "-"} />
          <Row label="City"    value={addr.city    || "-"} />
          <Row label="State"   value={addr.state   || "-"} />
          <Row label="Pincode" value={addr.pincode || "-"} />
        </InfoBlock>
        <InfoBlock icon="payment" label="Payment">
          <Row label="Method"   value={(order.paymentMethod || "-").toUpperCase()} />
          <Row label="Status"   value="completed" />
          <Row label="Subtotal" value={`₹${subtotal.toLocaleString()}`} />
          <Row label="Delivery" value="Free" />
          <div className="flex justify-between py-2 mt-0.5">
            <span className="text-[13px] font-medium text-[var(--color-text)]">Total</span>
            <span className="text-[15px] font-medium text-[var(--color-accent)] font-serif">₹{getAmount(order).toLocaleString()}</span>
          </div>
        </InfoBlock>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[var(--color-border-theme)] flex items-center gap-2 text-[11px] font-medium text-[var(--color-text)] uppercase tracking-wider">
          <Icon name="pkg" size={14} color="var(--color-gold)" /> Order items ({items.length})
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
            {items.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-[var(--color-surface)]" : "bg-[var(--color-stripe)]"}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-[var(--color-pri-light)] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="pkg" size={14} color="var(--color-accent)" />
                    </div>
                    <span className="text-[13px] font-medium text-[var(--color-text)]">{getItemTitle(item)}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[13px] text-[var(--color-muted)]">{getItemCategory(item)}</td>
                <td className="px-5 py-3.5">
                  <span className="bg-[var(--color-gold-light)] text-[#7a4f00] text-[11px] font-medium px-2.5 py-0.5 rounded-full">{item.size || "-"}</span>
                </td>
                <td className="px-5 py-3.5 text-[13px] text-[var(--color-text)]">{item.quantity || 1}</td>
                <td className="px-5 py-3.5 text-[13px] text-[var(--color-text)]">₹{getItemPrice(item).toLocaleString()}</td>
                <td className="px-5 py-3.5 text-[13px] font-medium text-[var(--color-text)]">
                  ₹{(getItemPrice(item) * (item.quantity || 1)).toLocaleString()}
                </td>
              </tr>
            ))}
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
                ₹{getAmount(order).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Orders List ──────────────────────────────────────────────────────
export default function OrdersPage({ filter, onOrderClick }) {
  const { orders, loading } = useAdminOrderStore()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState(
    filter === "pending"   ? "pending"   :
    filter === "delivered" ? "delivered" :
    filter === "cancelled" ? "cancelled" : "all"
  )

  const ordersArray = Array.isArray(orders) ? orders : []

  const filtered = ordersArray.filter(o => {
    const matchStatus = statusFilter === "all" || o.status === statusFilter
    const matchSearch =
      getName(o).toLowerCase().includes(search.toLowerCase()) ||
      getId(o).toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

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
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-lg text-[12px] cursor-pointer border transition ${statusFilter === s ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white font-medium" : "border-[var(--color-border-theme)] bg-transparent text-[var(--color-muted)] font-normal hover:border-[var(--color-accent)]"}`}>
            {s === "all" ? "All orders" : s}
          </button>
        ))}
      </div>

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
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-[var(--color-muted)] text-[13px]">Loading orders...</td>
              </tr>
            ) : filtered.map((o, i) => (
              <tr
                key={getId(o)}
                onClick={() => onOrderClick(o)}
                className={`${i % 2 === 0 ? "bg-[var(--color-surface)]" : "bg-[var(--color-stripe)]"} cursor-pointer hover:bg-[var(--color-gold-light)]/30 transition`}
              >
                <td className="px-4 py-3 text-[12px] font-medium text-[var(--color-accent)]">#{getId(o).slice(-6)}</td>
                <td className="px-4 py-3 text-[13px] text-[var(--color-text)]">{getName(o)}</td>
                <td className="px-4 py-3 text-[13px] text-[var(--color-muted)]">{getItems(o).length}</td>
                <td className="px-4 py-3 text-[13px] font-medium text-[var(--color-text)]">₹{getAmount(o).toLocaleString()}</td>
                <td className="px-4 py-3 text-[12px] text-[var(--color-muted)]">{getDate(o)}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3">
                  <button
                    onClick={e => { e.stopPropagation(); onOrderClick(o) }}
                    className="px-3 py-1.25 rounded-md text-[11px] border border-[var(--color-border-theme)] bg-transparent text-[var(--color-accent)] cursor-pointer font-medium hover:bg-[var(--color-pri-light)] transition"
                  >
                    View details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="text-center py-10 text-[var(--color-muted)] text-[13px]">No orders found</div>
        )}
      </div>
    </div>
  )
}
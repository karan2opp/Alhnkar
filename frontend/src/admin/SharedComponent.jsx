import React from "react"

// ── Icon Component ───────────────────────────────────────────────
export const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const s = { width: size, height: size, display: "inline-block", flexShrink: 0 }
  const icons = {
    grid: <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>,
    box: <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><path d="M8 1l6 3.5v7L8 15l-6-3.5v-7L8 1z"/><path d="M8 1v14M2 4.5l6 3.5 6-3.5"/></svg>,
    list: <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><path d="M2 4h12M2 8h12M2 12h12"/></svg>,
    clock: <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3.5l2 2"/></svg>,
    check: <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M5.5 8l2 2 3-3"/></svg>,
    x: <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M6 6l4 4M10 6l-4 4"/></svg>,
    plus: <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><path d="M8 2v12M2 8h12"/></svg>,
    search: <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><circle cx="7" cy="7" r="4"/><path d="M11 11l3 3"/></svg>,
    edit: <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><path d="M11 2l3 3-8 8H3v-3L11 2z"/></svg>,
    trash: <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10"/></svg>,
    pkg: <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><rect x="1" y="5" width="14" height="9" rx="1"/><path d="M5 5V3a3 3 0 016 0v2"/></svg>,
    revenue: <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><path d="M1 12l4-4 3 3 4-5 3 2"/></svg>,
    back: <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><path d="M10 3L5 8l5 5"/></svg>,
    map: <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><path d="M8 2C5.8 2 4 3.8 4 6c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z"/><circle cx="8" cy="6" r="1.5"/></svg>,
    user: <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5"/></svg>,
    payment: <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><rect x="1" y="3" width="14" height="10" rx="1"/><path d="M1 7h14"/></svg>,
  }
  return icons[name] || null
}

// ── Status Badge ─────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const map = {
    pending:   { bg: "bg-[#fff8e6]", color: "text-[#7a4f00]" },
    confirmed: { bg: "bg-[#e8f5e9]", color: "text-[#1b5e20]" },
    delivered: { bg: "bg-[#e8f5e9]", color: "text-[#1b5e20]" },
    cancelled: { bg: "bg-[#fdecea]", color: "text-[#7f1d1d]" },
  }
  const s = map[status] || map.pending
  return (
    <span className={`${s.bg} ${s.color} text-[11px] font-medium px-2.5 py-0.5 rounded-full inline-block`}>
      {status}
    </span>
  )
}

// ── Metric Card (Dashboard) ──────────────────────────────────────
export const MetricCard = ({ label, value, icon, sub, subColor }) => (
  <div className="bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-xl p-4.5 flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <span className="text-[13px] text-[var(--color-muted)]">{label}</span>
      <div className="bg-[var(--color-gold-light)] rounded-lg p-1.5">
        <Icon name={icon} size={15} color="var(--color-gold)" />
      </div>
    </div>
    <div className="text-[28px] font-medium text-[var(--color-text)] font-serif">{value}</div>
    {sub && <div className={`text-[11px] ${subColor ? `text-[${subColor}]` : "text-[var(--color-muted)]"}`}>{sub}</div>}
  </div>
)

// ── Info Block (Order Detail) ────────────────────────────────────
export const InfoBlock = ({ icon, label, children }) => (
  <div className="bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-xl p-4">
    <div className="flex items-center gap-2 mb-3">
      <Icon name={icon} size={14} color="var(--color-gold)" />
      <span className="text-[11px] font-medium text-[var(--color-text)] uppercase tracking-wider">{label}</span>
    </div>
    {children}
  </div>
)

// ── Row Helper ───────────────────────────────────────────────────
export const Row = ({ label, value }) => (
  <div className="flex justify-between py-1.5 border-b border-[var(--color-border-theme)]">
    <span className="text-[12px] text-[var(--color-muted)]">{label}</span>
    <span className="text-[12px] font-medium text-[var(--color-text)]">{value}</span>
  </div>
)
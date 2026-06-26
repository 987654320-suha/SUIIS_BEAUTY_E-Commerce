import React, { useState } from "react";
import { AdminSidebar } from "./AdminDashboard";
import { useToast } from "../../context/ToastContext";

const MOCK_ORDERS = [
  { id: "SUIIS12345678", customer: "Priya Sharma", email: "priya@email.com", phone: "9876543210", amount: 2548, status: "Delivered", date: "Apr 28, 2025", items: 3, payment: "UPI", city: "Mumbai" },
  { id: "SUIIS87654321", customer: "Ananya Mehta", email: "ananya@email.com", phone: "9812345678", amount: 1699, status: "Shipped", date: "May 1, 2025", items: 1, payment: "Credit Card", city: "Bangalore" },
  { id: "SUIIS11223344", customer: "Divya Rathi", email: "divya@email.com", phone: "9834567890", amount: 3499, status: "Processing", date: "May 2, 2025", items: 2, payment: "Net Banking", city: "Delhi" },
  { id: "SUIIS55667788", customer: "Komal Shah", email: "komal@email.com", phone: "9856789012", amount: 849, status: "Order Placed", date: "May 3, 2025", items: 1, payment: "COD", city: "Ahmedabad" },
  { id: "SUIIS99001122", customer: "Ritu Kapoor", email: "ritu@email.com", phone: "9878901234", amount: 5299, status: "Confirmed", date: "May 4, 2025", items: 4, payment: "UPI", city: "Pune" },
  { id: "SUIIS33445566", customer: "Sneha Nair", email: "sneha@email.com", phone: "9890123456", amount: 1299, status: "Out for Delivery", date: "May 5, 2025", items: 1, payment: "Wallet", city: "Chennai" },
  { id: "SUIIS77889900", customer: "Meera Joshi", email: "meera@email.com", phone: "9901234567", amount: 4999, status: "Delivered", date: "May 4, 2025", items: 5, payment: "EMI", city: "Hyderabad" },
  { id: "SUIIS44556677", customer: "Pooja Verma", email: "pooja@email.com", phone: "9923456789", amount: 699, status: "Cancelled", date: "May 3, 2025", items: 1, payment: "UPI", city: "Kolkata" },
  { id: "SUIIS22334455", customer: "Lakshmi Rao", email: "lakshmi@email.com", phone: "9945678901", amount: 2199, status: "Return Requested", date: "Apr 30, 2025", items: 2, payment: "Credit Card", city: "Jaipur" },
  { id: "SUIIS66778899", customer: "Gayatri Patil", email: "gayatri@email.com", phone: "9967890123", amount: 3299, status: "Shipped", date: "May 5, 2025", items: 3, payment: "Net Banking", city: "Surat" },
];

const STATUS_OPTIONS = ["All", "Order Placed", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Return Requested"];
const STATUS_COLORS = {
  "Order Placed": { bg: "rgba(201,169,110,0.12)", text: "#c9a96e", border: "rgba(201,169,110,0.3)" },
  "Confirmed": { bg: "rgba(201,169,110,0.12)", text: "#c9a96e", border: "rgba(201,169,110,0.3)" },
  "Processing": { bg: "rgba(184,212,216,0.12)", text: "#b8d4d8", border: "rgba(184,212,216,0.3)" },
  "Shipped": { bg: "rgba(184,212,216,0.12)", text: "#b8d4d8", border: "rgba(184,212,216,0.3)" },
  "Out for Delivery": { bg: "rgba(232,160,180,0.12)", text: "#e8a0b4", border: "rgba(232,160,180,0.3)" },
  "Delivered": { bg: "rgba(126,200,138,0.12)", text: "#7ec88a", border: "rgba(126,200,138,0.3)" },
  "Cancelled": { bg: "rgba(232,112,112,0.12)", text: "#e87070", border: "rgba(232,112,112,0.3)" },
  "Return Requested": { bg: "rgba(232,160,180,0.12)", text: "#e8a0b4", border: "rgba(232,160,180,0.3)" },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const { toast } = useToast();

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = filtered.reduce((s, o) => s + (o.status !== "Cancelled" ? o.amount : 0), 0);

  const updateStatus = (orderId, status) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    toast.success(`Order ${orderId} updated to "${status}"`);
    setSelectedOrder(null);
  };

  const StatusBadge = ({ status }) => {
    const c = STATUS_COLORS[status] || { bg: "var(--clr-bg-3)", text: "var(--clr-text-3)", border: "var(--clr-border-2)" };
    return (
      <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: c.text, background: c.bg, border: `1px solid ${c.border}`, padding: "3px 9px", whiteSpace: "nowrap" }}>{status}</span>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--clr-bg)" }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <div style={{ padding: "20px 32px", borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "var(--clr-text)" }}>Orders</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", marginTop: "2px" }}>
              {filtered.length} orders · Revenue: ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
          <button onClick={() => toast.info("Exporting orders...")} style={{ padding: "10px 20px", background: "var(--clr-bg-3)", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-primary)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.color = "var(--clr-text-2)"; }}>
            📤 Export CSV
          </button>
        </div>

        <div style={{ padding: "24px 32px" }}>
          {/* Summary Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "24px" }}>
            {[
              { label: "Total", count: orders.length, color: "var(--clr-text-2)" },
              { label: "Processing", count: orders.filter(o => ["Order Placed", "Confirmed", "Processing"].includes(o.status)).length, color: "#c9a96e" },
              { label: "Shipped", count: orders.filter(o => ["Shipped", "Out for Delivery"].includes(o.status)).length, color: "#b8d4d8" },
              { label: "Delivered", count: orders.filter(o => o.status === "Delivered").length, color: "#7ec88a" },
              { label: "Cancelled", count: orders.filter(o => o.status === "Cancelled").length, color: "#e87070" },
            ].map(s => (
              <div key={s.label} style={{ padding: "16px 18px", background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 400, color: s.color, marginBottom: "2px" }}>{s.count}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", padding: "0 14px", gap: "8px", flex: "1 1 200px" }}
              onFocusCapture={e => e.currentTarget.style.borderColor = "var(--clr-primary)"}
              onBlurCapture={e => e.currentTarget.style.borderColor = "var(--clr-border-2)"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--clr-text-3)" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID, customer, email..." style={{ flex: 1, padding: "10px 0", background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text)" }} />
              {search && <button onClick={() => setSearch("")} style={{ color: "var(--clr-text-3)", fontSize: "16px", background: "none", border: "none", cursor: "pointer" }}>×</button>}
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: "10px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none", cursor: "pointer" }}>
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Orders Table */}
          <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--clr-bg-3)" }}>
                  {["Order ID", "Customer", "Date", "Amount", "Items", "Payment", "Status", "Actions"].map(h => (
                    <th key={h} style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", padding: "14px 16px", textAlign: "left", borderBottom: "1px solid var(--clr-divider)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id} style={{ borderBottom: "1px solid var(--clr-divider)", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--clr-bg-3)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: "var(--clr-primary)" }}>{order.id}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "var(--clr-text)" }}>{order.customer}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>{order.city}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-2)" }}>{order.date}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "15px", color: "var(--clr-primary)" }}>₹{order.amount.toLocaleString("en-IN")}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-2)" }}>{order.items} items</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", border: "1px solid var(--clr-border-2)", padding: "3px 8px", whiteSpace: "nowrap" }}>{order.payment}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatusBadge status={order.status} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => { setSelectedOrder(order); setNewStatus(order.status); }} style={{ padding: "5px 12px", border: "1px solid var(--clr-primary)", background: "transparent", color: "var(--clr-primary)", fontFamily: "var(--font-body)", fontSize: "11px", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }} onMouseEnter={e => { e.currentTarget.style.background = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-bg)"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--clr-primary)"; }}>
                          Edit Status
                        </button>
                        <button onClick={() => toast.info(`Invoice for ${order.id} downloading...`)} style={{ padding: "5px 10px", border: "1px solid var(--clr-border-2)", background: "transparent", color: "var(--clr-text-2)", fontFamily: "var(--font-body)", fontSize: "11px", cursor: "pointer", transition: "all 0.2s" }}>
                          📄
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px", fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text-3)" }}>
                No orders found matching your filters.
              </div>
            )}
          </div>
        </div>

        {/* Status Update Modal */}
        {selectedOrder && (
          <div onClick={() => setSelectedOrder(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border)", width: "min(480px,100%)", padding: "36px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "6px" }}>Update Order Status</h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", marginBottom: "24px" }}>Order: <strong style={{ color: "var(--clr-primary)" }}>{selectedOrder.id}</strong> — {selectedOrder.customer}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                {STATUS_OPTIONS.filter(s => s !== "All").map(status => {
                  const c = STATUS_COLORS[status] || {};
                  return (
                    <label key={status} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: newStatus === status ? (c.bg || "rgba(201,169,110,0.08)") : "var(--clr-bg-3)", border: `1px solid ${newStatus === status ? (c.border || "var(--clr-primary)") : "var(--clr-border-2)"}`, cursor: "pointer", transition: "all 0.2s" }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${newStatus === status ? (c.text || "var(--clr-primary)") : "var(--clr-border-2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {newStatus === status && <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.text || "var(--clr-primary)" }} />}
                      </div>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: newStatus === status ? (c.text || "var(--clr-primary)") : "var(--clr-text-2)", fontWeight: newStatus === status ? 500 : 300 }}>{status}</span>
                      <input type="radio" checked={newStatus === status} onChange={() => setNewStatus(status)} style={{ display: "none" }} />
                    </label>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => updateStatus(selectedOrder.id, newStatus)} style={{ flex: 1, padding: "13px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Update Status
                </button>
                <button onClick={() => setSelectedOrder(null)} style={{ padding: "13px 20px", background: "transparent", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
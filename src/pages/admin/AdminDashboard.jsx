import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ALL_PRODUCTS } from "../../data/products";

const ADMIN_NAV = [
  { path: "/admin", label: "Dashboard", icon: "📊" },
  { path: "/admin/products", label: "Products", icon: "💄" },
  { path: "/admin/orders", label: "Orders", icon: "📦" },
  { path: "/admin/users", label: "Users", icon: "👥" },
  { path: "/admin/coupons", label: "Coupons", icon: "🎟" },
  { path: "/admin/analytics", label: "Analytics", icon: "📈" },
  { path: "/seller", label: "Seller Panel", icon: "🏪" },
  { path: "/", label: "← Back to Site", icon: "🌐" },
];

export function AdminSidebar() {
  const location = useLocation();
  return (
    <aside style={{ width: 220, background: "#0d0d0d", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", minHeight: "100vh", flexShrink: 0 }}>
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 300, letterSpacing: "0.15em", color: "var(--clr-text)", textTransform: "uppercase" }}>Suiis</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--clr-primary)", marginTop: "1px" }}>Admin Panel</div>
      </div>
      <nav style={{ padding: "16px 0", flex: 1 }}>
        {ADMIN_NAV.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", textDecoration: "none", background: active ? "rgba(201,169,110,0.1)" : "transparent", borderLeft: `3px solid ${active ? "var(--clr-primary)" : "transparent"}`, color: active ? "var(--clr-primary)" : "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: active ? 500 : 300, letterSpacing: "0.04em", transition: "all 0.2s" }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; } }}>
              <span style={{ fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function StatCard({ icon, label, value, change, color = "var(--clr-primary)" }) {
  const positive = change >= 0;
  return (
    <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "24px", transition: "border-color 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--clr-border-2)"}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <span style={{ fontSize: "28px" }}>{icon}</span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, color: positive ? "#7ec88a" : "#e87070", background: positive ? "rgba(126,200,138,0.1)" : "rgba(232,112,112,0.1)", padding: "3px 8px" }}>
          {positive ? "↑" : "↓"} {Math.abs(change)}%
        </span>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 400, color, marginBottom: "4px" }}>{value}</div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const STATS = [
    { icon: "💰", label: "Total Revenue", value: "₹4,82,350", change: 18.2, color: "var(--clr-primary)" },
    { icon: "📦", label: "Total Orders", value: "1,247", change: 12.5, color: "#7ec88a" },
    { icon: "👥", label: "Active Users", value: "8,920", change: 24.1, color: "#b8d4d8" },
    { icon: "💄", label: "Products Listed", value: ALL_PRODUCTS.length, change: 4.8, color: "var(--clr-accent)" },
  ];

  const RECENT_ORDERS = [
    { id: "SUIIS12345678", customer: "Priya Sharma", amount: "₹2,548", status: "Delivered", date: "Apr 28" },
    { id: "SUIIS87654321", customer: "Ananya Mehta", amount: "₹1,699", status: "Shipped", date: "May 1" },
    { id: "SUIIS11223344", customer: "Divya Rathi", amount: "₹3,499", status: "Processing", date: "May 2" },
    { id: "SUIIS55667788", customer: "Komal Shah", amount: "₹849", status: "Order Placed", date: "May 3" },
    { id: "SUIIS99001122", customer: "Ritu Kapoor", amount: "₹5,299", status: "Confirmed", date: "May 4" },
  ];

  const STATUS_COLORS = { "Delivered": "#7ec88a", "Shipped": "#b8d4d8", "Processing": "#c9a96e", "Order Placed": "#c9a96e", "Confirmed": "#e8a0b4" };

  const TOP_PRODUCTS = ALL_PRODUCTS.sort((a, b) => b.reviews - a.reviews).slice(0, 5);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--clr-bg)", fontFamily: "var(--font-body)" }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Top Bar */}
        <div style={{ padding: "20px 32px", borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "var(--clr-text)" }}>Dashboard</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", marginTop: "2px" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/admin/products" style={{ padding: "10px 20px", background: "var(--clr-primary)", color: "var(--clr-bg)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", transition: "background 0.2s" }}>+ Add Product</Link>
          </div>
        </div>

        <div style={{ padding: "32px" }}>
          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
            {STATS.map(s => <StatCard key={s.label} {...s} />)}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px", marginBottom: "24px" }}>
            {/* Recent Orders */}
            <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 400, color: "var(--clr-text)" }}>Recent Orders</h2>
                <Link to="/admin/orders" style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-primary)", textDecoration: "none", letterSpacing: "0.08em" }}>View All →</Link>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Order ID", "Customer", "Amount", "Status", "Date"].map(h => (
                      <th key={h} style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", padding: "0 0 12px", textAlign: "left", borderBottom: "1px solid var(--clr-divider)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_ORDERS.map(order => (
                    <tr key={order.id}>
                      {[
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-primary)", fontWeight: 500 }}>{order.id}</span>,
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-2)" }}>{order.customer}</span>,
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: "var(--clr-text)" }}>{order.amount}</span>,
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, color: STATUS_COLORS[order.status], background: `${STATUS_COLORS[order.status]}15`, padding: "3px 9px", whiteSpace: "nowrap" }}>{order.status}</span>,
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>{order.date}</span>,
                      ].map((cell, i) => (
                        <td key={i} style={{ padding: "12px 0", borderBottom: "1px solid var(--clr-divider)", paddingRight: "12px" }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top Products */}
            <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 400, color: "var(--clr-text)" }}>Top Products</h2>
                <Link to="/admin/products" style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-primary)", textDecoration: "none" }}>Manage →</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {TOP_PRODUCTS.map((p, i) => (
                  <div key={p._id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--clr-primary)", width: 20, flexShrink: 0 }}>{i + 1}</span>
                    <img src={p.image} alt={p.name} style={{ width: 40, height: 40, objectFit: "cover", flexShrink: 0, border: "1px solid var(--clr-border-2)" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, color: "var(--clr-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>₹{p.price.toLocaleString("en-IN")} · {p.reviews} reviews</div>
                    </div>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: "var(--clr-primary)", flexShrink: 0 }}>₹{p.price.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { title: "Pending Orders", value: "23", icon: "⏳", color: "#c9a96e", desc: "Require processing" },
              { title: "Low Stock Alerts", value: "4", icon: "⚠️", color: "#e87070", desc: "Products below 20 units" },
              { title: "New Reviews Today", value: "12", icon: "⭐", color: "#b8d4d8", desc: "Across all products" },
            ].map(s => (
              <div key={s.title} style={{ background: "var(--clr-bg-2)", border: `1px solid ${s.color}30`, padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "28px" }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: s.color, lineHeight: 1, marginBottom: "2px" }}>{s.value}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, color: "var(--clr-text)", marginBottom: "1px" }}>{s.title}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
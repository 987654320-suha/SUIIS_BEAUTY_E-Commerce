import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useOrders } from "../context/OrderContext";

export default function TrackOrder() {
  const location = useLocation();
  const { orders, getOrder } = useOrders();
  const [input, setInput] = useState(location.state?.orderId || "");
  const [searched, setSearched] = useState(!!location.state?.orderId);
  const order = searched ? getOrder(input.trim().toUpperCase()) : null;

  const statusColor = { "Delivered": "#7ec88a", "Shipped": "#b8d4d8", "Out for Delivery": "#e8a0b4", "Processing": "#c9a96e", "Order Placed": "#c9a96e", "Confirmed": "#c9a96e" };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)" }}>
      <div style={{ borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "14px", fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>
            <Link to="/" style={{ color: "var(--clr-text-3)", textDecoration: "none" }}>Home</Link><span>/</span><span style={{ color: "var(--clr-text-2)" }}>Track Order</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: "var(--clr-text)", marginBottom: "6px" }}>Track Your Order</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)" }}>Enter your order ID to get real-time updates.</p>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 40px 80px" }}>
        {/* Search Form */}
        <form onSubmit={handleSearch} style={{ marginBottom: "48px" }}>
          <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "10px" }}>Order ID</label>
          <div style={{ display: "flex" }}>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="e.g. SUIIS12345678"
              style={{ flex: 1, padding: "14px 18px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", borderRight: "none", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "15px", outline: "none", transition: "border-color 0.2s", letterSpacing: "0.05em" }}
              onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
              onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
            <button type="submit" style={{ padding: "14px 32px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", flexShrink: 0, transition: "background 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--clr-primary-light)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--clr-primary)"}>
              Track
            </button>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-muted)", marginTop: "8px" }}>
            Try: SUIIS12345678 or SUIIS87654321
          </p>
        </form>

        {/* Result */}
        {searched && !order && (
          <div style={{ textAlign: "center", padding: "48px", background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}>🔍</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 300, color: "var(--clr-text-2)", marginBottom: "10px" }}>Order Not Found</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)" }}>Check your order ID and try again. You can find it in your confirmation email or <Link to="/orders" style={{ color: "var(--clr-primary)" }}>My Orders</Link>.</p>
          </div>
        )}

        {order && (
          <div>
            {/* Order Summary Card */}
            <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "28px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", marginBottom: "4px" }}>Order ID</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--clr-text)" }}>{order.id}</div>
                </div>
                <span style={{ padding: "7px 18px", background: `${statusColor[order.status] || "var(--clr-primary)"}20`, border: `1px solid ${statusColor[order.status] || "var(--clr-primary)"}50`, fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: statusColor[order.status] || "var(--clr-primary)", letterSpacing: "0.1em" }}>
                  {order.status}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                {[["Ordered On", order.date], ["Payment", order.payment], ["Total", `₹${order.total.toLocaleString("en-IN")}`]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", marginBottom: "3px" }}>{l}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text)" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Progress Bar */}
            <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "28px", marginBottom: "20px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "24px" }}>Shipment Progress</h3>

              {/* Progress Steps */}
              <div style={{ position: "relative", marginBottom: "32px" }}>
                {/* Progress line */}
                <div style={{ position: "absolute", top: 11, left: "11px", right: "11px", height: 2, background: "var(--clr-bg-3)", zIndex: 0 }}>
                  <div style={{ height: "100%", width: `${(order.statusIndex / 5) * 100}%`, background: statusColor[order.status] || "var(--clr-primary)", transition: "width 1s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                  {order.tracking.map((step, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: step.done ? (statusColor[order.status] || "var(--clr-primary)") : "var(--clr-bg-3)", border: `2px solid ${step.done ? (statusColor[order.status] || "var(--clr-primary)") : "var(--clr-border-2)"}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px", transition: "all 0.3s", flexShrink: 0 }}>
                        {step.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={step.done ? "white" : "none"} strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                      </div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: step.done ? 500 : 300, color: step.done ? "var(--clr-text)" : "var(--clr-text-muted)", textAlign: "center", lineHeight: 1.3, maxWidth: "70px" }}>{step.status}</div>
                      {step.time && <div style={{ fontFamily: "var(--font-body)", fontSize: "9px", color: statusColor[order.status] || "var(--clr-primary)", textAlign: "center", marginTop: "2px" }}>{step.time}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Delivery */}
              {order.status !== "Delivered" && order.status !== "Cancelled" && (
                <div style={{ padding: "14px 18px", background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "20px" }}>🚚</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "var(--clr-text)" }}>Estimated Delivery</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-primary)", marginTop: "1px" }}>
                      {new Date(Date.now() + 2 * 86400000).toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Deliver Address */}
            {order.address && (
              <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "22px 28px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "10px" }}>Delivering To</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-2)", fontWeight: 300, lineHeight: 1.8 }}>
                  {order.address.name} · {order.address.line1}, {order.address.city}, {order.address.state} — {order.address.pincode}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Recent Orders Quick Access */}
        {!searched && orders.length > 0 && (
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "16px" }}>Recent Orders</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {orders.slice(0, 3).map(o => (
                <button key={o.id} onClick={() => { setInput(o.id); setSearched(true); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-primary)"; e.currentTarget.style.background = "var(--clr-bg-3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.background = "var(--clr-bg-2)"; }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "var(--clr-text)", marginBottom: "2px" }}>{o.id}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>{o.date} · {o.items.length} items · ₹{o.total.toLocaleString("en-IN")}</div>
                  </div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, color: statusColor[o.status] || "var(--clr-primary)", border: `1px solid ${statusColor[o.status] || "var(--clr-primary)"}40`, padding: "4px 10px", flexShrink: 0 }}>{o.status}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
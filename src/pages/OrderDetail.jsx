import React from "react";
import { useParams, Link } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function OrderDetail() {
  const { id } = useParams();
  const { getOrder, requestReturn } = useOrders();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const order = getOrder(id);

  if (!order) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
        <div style={{ fontSize: "64px", opacity: 0.2 }}>📦</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "var(--clr-text-2)" }}>Order Not Found</h2>
        <Link to="/orders" style={{ padding: "12px 28px", background: "var(--clr-primary)", color: "var(--clr-bg)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>Back to Orders</Link>
      </div>
    );
  }

  const statusColors = { "Delivered": "#7ec88a", "Shipped": "#b8d4d8", "Processing": "#c9a96e", "Order Placed": "#c9a96e", "Cancelled": "#e87070" };
  const sc = statusColors[order.status] || "var(--clr-primary)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)" }}>
      <div style={{ borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", padding: "36px 40px 28px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "14px", fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>
            <Link to="/" style={{ color: "var(--clr-text-3)", textDecoration: "none" }}>Home</Link><span>/</span>
            <Link to="/orders" style={{ color: "var(--clr-text-3)", textDecoration: "none" }}>Orders</Link><span>/</span>
            <span style={{ color: "var(--clr-text-2)" }}>{order.id}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 300, color: "var(--clr-text)", marginBottom: "4px" }}>Order Details</h1>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)" }}>{order.id} · Placed on {order.date}</p>
            </div>
            <span style={{ padding: "7px 18px", background: `${sc}15`, border: `1px solid ${sc}50`, fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: sc, letterSpacing: "0.1em" }}>{order.status}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 40px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" }}>

          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Tracking Timeline */}
            <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "28px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "24px" }}>Tracking Timeline</h2>
              <div style={{ position: "relative" }}>
                {order.tracking.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: "16px", marginBottom: i < order.tracking.length - 1 ? "0" : "0" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: step.done ? sc : "var(--clr-bg-3)", border: `2px solid ${step.done ? sc : "var(--clr-border-2)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", zIndex: 1 }}>
                        {step.done && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--clr-bg)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                      </div>
                      {i < order.tracking.length - 1 && (
                        <div style={{ width: 2, height: 36, background: step.done && order.tracking[i + 1]?.done ? sc : "var(--clr-border-2)", transition: "background 0.3s" }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: i < order.tracking.length - 1 ? "0" : "0", paddingTop: "2px" }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: step.done ? 500 : 300, color: step.done ? "var(--clr-text)" : "var(--clr-text-muted)", marginBottom: "2px" }}>{step.status}</div>
                      {step.time && <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: sc, marginBottom: "28px" }}>{step.time}</div>}
                      {!step.time && <div style={{ marginBottom: "28px" }} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items */}
            <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "28px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "20px" }}>Order Items ({order.items.length})</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "16px", alignItems: "center", padding: "14px 0", borderBottom: i < order.items.length - 1 ? "1px solid var(--clr-divider)" : "none" }}>
                    <img src={item.image} alt={item.name} style={{ width: 72, height: 72, objectFit: "cover", border: "1px solid var(--clr-border-2)", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "17px", color: "var(--clr-text)", marginBottom: "3px" }}>{item.name}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>Qty: {item.qty}</div>
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--clr-primary)", flexShrink: 0 }}>₹{(item.price * item.qty).toLocaleString("en-IN")}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "28px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "14px" }}>Delivery Address</h2>
              {order.address && (
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text-2)", fontWeight: 300, lineHeight: 1.8 }}>
                  <strong style={{ color: "var(--clr-text)", fontWeight: 500 }}>{order.address.name}</strong><br />
                  {order.address.line1}<br />
                  {order.address.city}, {order.address.state} — {order.address.pincode}<br />
                  📞 {order.address.phone}
                </p>
              )}
            </div>
          </div>

          {/* Right: Summary */}
          <div style={{ position: "sticky", top: 92 }}>
            <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "26px", marginBottom: "14px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid var(--clr-divider)" }}>Price Breakdown</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                {[
                  { l: "Item Total", v: `₹${order.total.toLocaleString("en-IN")}` },
                  { l: "Shipping", v: "FREE", c: "#7ec88a" },
                  { l: "Payment Method", v: order.payment },
                ].map(r => (
                  <div key={r.l} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)" }}>{r.l}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: r.c || "var(--clr-text)", fontWeight: r.c ? 500 : 400 }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div style={{ paddingTop: "14px", borderTop: "1px solid var(--clr-divider)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-2)" }}>Total Paid</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--clr-primary)" }}>₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link to="/track-order" state={{ orderId: order.id }} style={{ display: "block", padding: "13px", background: "var(--clr-primary)", color: "var(--clr-bg)", textDecoration: "none", textAlign: "center", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                🚚 Track Shipment
              </Link>
              <button onClick={() => { order.items.forEach(item => addToCart({ _id: item.name, name: item.name, price: item.price, image: item.image, category: "Reorder" })); toast.success("All items added to cart!"); }} style={{ padding: "12px", background: "transparent", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-primary)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.color = "var(--clr-text-2)"; }}>
                🔄 Reorder All
              </button>
              <button onClick={() => toast.info("Invoice downloading...")} style={{ padding: "12px", background: "transparent", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", transition: "all 0.2s" }}>
                📄 Download Invoice
              </button>
              {order.canReturn && !order.returnRequested && (
                <Link to="/returns" state={{ orderId: order.id }} style={{ display: "block", padding: "12px", background: "transparent", color: "#e87070", border: "1px solid rgba(232,112,112,0.4)", textDecoration: "none", textAlign: "center", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  ↩ Request Return
                </Link>
              )}
              {order.returnRequested && (
                <div style={{ padding: "12px", background: "rgba(232,160,180,0.08)", border: "1px solid rgba(232,160,180,0.3)", textAlign: "center", fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-accent)" }}>
                  Return Requested ✓
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
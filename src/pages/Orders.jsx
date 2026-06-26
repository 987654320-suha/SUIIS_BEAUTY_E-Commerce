import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const STATUS_COLORS = {
  "Order Placed": "#c9a96e",
  "Confirmed": "#c9a96e",
  "Processing": "#b8d4d8",
  "Shipped": "#b8d4d8",
  "Out for Delivery": "#e8a0b4",
  "Delivered": "#7ec88a",
  "Cancelled": "#e87070",
  "Return Requested": "#e8a0b4",
};

export default function Orders() {
  const { orders } = useOrders();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");

  const FILTERS = ["all", "Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const handleReorder = (order) => {
    order.items.forEach(item => {
      addToCart({ _id: item.name, name: item.name, price: item.price, image: item.image, category: "Reorder" });
    });
    toast.success("Items added to cart! 🛍️");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)" }}>
      <div style={{ borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "14px", fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>
            <Link to="/" style={{ color: "var(--clr-text-3)", textDecoration: "none" }}>Home</Link><span>/</span>
            <Link to="/profile" style={{ color: "var(--clr-text-3)", textDecoration: "none" }}>Account</Link><span>/</span>
            <span style={{ color: "var(--clr-text-2)" }}>Orders</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: "var(--clr-text)", marginBottom: "4px" }}>My Orders</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)" }}>{orders.length} total orders</p>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 40px 80px" }}>
        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "32px", flexWrap: "wrap" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 16px", border: `1px solid ${filter === f ? "var(--clr-primary)" : "var(--clr-border-2)"}`, background: filter === f ? "rgba(201,169,110,0.1)" : "transparent", color: filter === f ? "var(--clr-primary)" : "var(--clr-text-3)", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, textTransform: "capitalize", letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.2s" }}>
              {f === "all" ? "All Orders" : f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "64px", marginBottom: "20px", opacity: 0.2 }}>📦</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "var(--clr-text-2)", marginBottom: "12px" }}>No orders yet</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text-3)", marginBottom: "28px" }}>Start shopping to see your orders here.</p>
            <Link to="/shop" style={{ padding: "13px 32px", background: "var(--clr-primary)", color: "var(--clr-bg)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>Shop Now</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filtered.map(order => (
              <div key={order.id} style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", overflow: "hidden", transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--clr-border)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--clr-border-2)"}>
                {/* Order Header */}
                <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--clr-divider)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", background: "var(--clr-bg-3)" }}>
                  <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
                    {[["Order ID", order.id], ["Date", order.date], ["Total", `₹${order.total.toLocaleString("en-IN")}`], ["Payment", order.payment]].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", marginBottom: "2px" }}>{l}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400, color: "var(--clr-text)" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ padding: "5px 14px", background: `${STATUS_COLORS[order.status]}15`, border: `1px solid ${STATUS_COLORS[order.status]}40`, fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", color: STATUS_COLORS[order.status] }}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ padding: "18px 24px" }}>
                  <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "18px" }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: "cover", border: "1px solid var(--clr-border-2)", flexShrink: 0 }} />
                        <div>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: "var(--clr-text)" }}>{item.name}</div>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>Qty: {item.qty} · ₹{item.price.toLocaleString("en-IN")}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", paddingTop: "14px", borderTop: "1px solid var(--clr-divider)" }}>
                    <Link to={`/orders/${order.id}`} style={{ padding: "8px 18px", border: "1px solid var(--clr-primary)", background: "transparent", color: "var(--clr-primary)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-bg)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--clr-primary)"; }}>
                      View Details
                    </Link>
                    <Link to="/track-order" state={{ orderId: order.id }} style={{ padding: "8px 18px", border: "1px solid var(--clr-border-2)", background: "transparent", color: "var(--clr-text-2)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.2s" }}>
                      Track Order
                    </Link>
                    {order.canReorder && (
                      <button onClick={() => handleReorder(order)} style={{ padding: "8px 18px", border: "1px solid var(--clr-border-2)", background: "transparent", color: "var(--clr-text-2)", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-primary)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.color = "var(--clr-text-2)"; }}>
                        Reorder
                      </button>
                    )}
                    {order.canReturn && !order.returnRequested && (
                      <Link to="/returns" state={{ orderId: order.id }} style={{ padding: "8px 18px", border: "1px solid var(--clr-border-2)", background: "transparent", color: "var(--clr-text-2)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Return / Replace
                      </Link>
                    )}
                    <button onClick={() => toast.info("Invoice downloading...")} style={{ padding: "8px 18px", border: "1px solid var(--clr-border-2)", background: "transparent", color: "var(--clr-text-2)", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}>
                      📄 Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
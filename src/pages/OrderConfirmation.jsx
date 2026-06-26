import React, { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrders } from "../context/OrderContext";

export default function OrderConfirmation() {
  const { id } = useParams();
  const { getOrder } = useOrders();
  const order = getOrder(id);
  const confettiRef = useRef(null);

  useEffect(() => {
    // Simple confetti animation
    const canvas = confettiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width, y: -10,
      w: 8 + Math.random() * 8, h: 4 + Math.random() * 4,
      color: ["#c9a96e", "#e8a0b4", "#b8d4d8", "#ffffff", "#FFD700"][Math.floor(Math.random() * 5)],
      rot: Math.random() * 360, speed: 2 + Math.random() * 3,
      rotSpeed: (Math.random() - 0.5) * 3,
    }));
    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.speed; p.rot += p.rotSpeed;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color; ctx.globalAlpha = 0.85;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      });
      if (pieces.some(p => p.y < canvas.height + 10)) animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)", position: "relative", overflow: "hidden" }}>
      <canvas ref={confettiRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10 }} />
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "80px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Success Icon */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(126,200,138,0.15)", border: "2px solid #7ec88a",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px", fontSize: "36px",
          animation: "popIn 0.5s var(--ease-bounce)",
        }}>✓</div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "48px", fontWeight: 300, color: "var(--clr-text)", marginBottom: "12px" }}>
          Order Placed!
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text-3)", fontWeight: 300, lineHeight: 1.7, marginBottom: "32px" }}>
          Thank you for shopping with SUIIS Beauty! Your order has been confirmed and is being processed.
        </p>

        {order && (
          <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "32px", marginBottom: "32px", textAlign: "left" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
              {[
                { label: "Order ID", value: order.id },
                { label: "Date", value: order.date },
                { label: "Payment", value: order.payment },
                { label: "Total", value: `₹${order.total.toLocaleString("en-IN")}` },
              ].map(d => (
                <div key={d.label}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", marginBottom: "4px" }}>{d.label}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--clr-primary)" }}>{d.value}</div>
                </div>
              ))}
            </div>
            {/* Items */}
            <div style={{ borderTop: "1px solid var(--clr-divider)", paddingTop: "20px" }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
                  <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "15px", color: "var(--clr-text)" }}>{item.name}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>Qty: {item.qty} · ₹{item.price.toLocaleString("en-IN")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tracking Timeline */}
        <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "28px", marginBottom: "32px", textAlign: "left" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "20px" }}>Tracking Progress</h3>
          {["Order Placed", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered"].map((s, i) => (
            <div key={s} style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: i === 0 ? "#7ec88a" : "var(--clr-bg-3)", border: `2px solid ${i === 0 ? "#7ec88a" : "var(--clr-border-2)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i === 0 && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--clr-bg)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                </div>
                {i < 5 && <div style={{ width: 1, height: 20, background: i === 0 ? "#7ec88a" : "var(--clr-border-2)", marginTop: "4px" }} />}
              </div>
              <div style={{ paddingBottom: "4px" }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: i === 0 ? 500 : 300, color: i === 0 ? "var(--clr-text)" : "var(--clr-text-3)" }}>{s}</div>
                {i === 0 && <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#7ec88a", marginTop: "2px" }}>Just now</div>}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/orders" style={{
            padding: "13px 28px", background: "var(--clr-primary)", color: "var(--clr-bg)", textDecoration: "none",
            fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase",
          }}>Track Order</Link>
          <Link to="/shop" style={{
            padding: "13px 28px", background: "transparent", color: "var(--clr-text-2)",
            border: "1px solid var(--clr-border)", textDecoration: "none",
            fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase",
          }}>Continue Shopping</Link>
        </div>

        {/* Invoice Download */}
        <button onClick={() => alert("Invoice download coming soon!")} style={{
          marginTop: "16px", background: "none", border: "none", cursor: "pointer",
          fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-primary)",
          letterSpacing: "0.08em", textDecoration: "underline",
        }}>📄 Download Invoice</button>
      </div>
      <style>{`
        @keyframes popIn { 0% { transform: scale(0); } 70% { transform: scale(1.15); } 100% { transform: scale(1); } }
      `}</style>
    </div>
  );
}
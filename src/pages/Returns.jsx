// Returns page
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import { useToast } from "../context/ToastContext";

export default function Returns() {
  const location = useLocation();
  const { orders, requestReturn } = useOrders();
  const { toast } = useToast();
  const [orderId, setOrderId] = useState(location.state?.orderId || "");
  const [reason, setReason] = useState("");
  const [type, setType] = useState("return");
  const [step, setStep] = useState(location.state?.orderId ? 2 : 1);
  const [submitted, setSubmitted] = useState(false);

  const REASONS = ["Product damaged on delivery", "Wrong item received", "Product doesn't match description", "Quality not as expected", "Changed my mind", "Size/shade doesn't suit me", "Other"];

  const selectedOrder = orders.find(o => o.id === orderId);

  const handleSubmit = () => {
    if (!reason) { toast.error("Please select a reason"); return; }
    requestReturn(orderId);
    setSubmitted(true);
    toast.success("Return request submitted successfully!");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)" }}>
      <div style={{ borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "14px", fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>
            <Link to="/" style={{ color: "var(--clr-text-3)", textDecoration: "none" }}>Home</Link><span>/</span><span style={{ color: "var(--clr-text-2)" }}>Returns & Refunds</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: "var(--clr-text)", marginBottom: "6px" }}>Returns & Refunds</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)" }}>Easy 15-day return policy. Refunds processed in 5–7 business days.</p>
        </div>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 40px 80px" }}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "48px", background: "var(--clr-bg-2)", border: "1px solid rgba(126,200,138,0.3)" }}>
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>✅</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 300, color: "var(--clr-text)", marginBottom: "12px" }}>Return Request Submitted!</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text-3)", lineHeight: 1.7, marginBottom: "28px", maxWidth: "420px", margin: "0 auto 28px" }}>
              We've received your return request for order <strong style={{ color: "var(--clr-primary)" }}>{orderId}</strong>. Our team will contact you within 24 hours to schedule a pickup.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
              {[["📅", "Pickup Scheduled", "Within 48 hours"], ["📦", "Item Collected", "Courier will collect"], ["✓", "Refund Processed", "5-7 business days to bank"]].map(([ic, t, d]) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", textAlign: "left" }}>
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>{ic}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "var(--clr-text)" }}>{t}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Link to="/orders" style={{ padding: "12px 28px", background: "var(--clr-primary)", color: "var(--clr-bg)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>My Orders</Link>
              <Link to="/" style={{ padding: "12px 28px", background: "transparent", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>Continue Shopping</Link>
            </div>
          </div>
        ) : (
          <>
            {/* Policy Banner */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--clr-divider)", border: "1px solid var(--clr-divider)", marginBottom: "36px" }}>
              {[["15 Days", "Return Window"], ["5–7 Days", "Refund to Bank"], ["Free", "Pickup Service"]].map(([v, l]) => (
                <div key={l} style={{ padding: "18px", background: "var(--clr-bg-2)", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--clr-primary)", marginBottom: "4px" }}>{v}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{l}</div>
                </div>
              ))}
            </div>

            {step === 1 && (
              <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "32px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "20px" }}>Select Order</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                  {orders.filter(o => o.canReturn).map(o => (
                    <div key={o.id} onClick={() => setOrderId(o.id)} style={{ padding: "16px 20px", border: `1px solid ${orderId === o.id ? "var(--clr-primary)" : "var(--clr-border-2)"}`, background: orderId === o.id ? "rgba(201,169,110,0.06)" : "var(--clr-bg-3)", cursor: "pointer", transition: "all 0.2s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "var(--clr-text)" }}>{o.id}</div>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", marginTop: "2px" }}>{o.date} · {o.items.length} items · ₹{o.total.toLocaleString("en-IN")}</div>
                        </div>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${orderId === o.id ? "var(--clr-primary)" : "var(--clr-border-2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                          {orderId === o.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--clr-primary)" }} />}
                        </div>
                      </div>
                    </div>
                  ))}
                  {orders.filter(o => o.canReturn).length === 0 && (
                    <div style={{ textAlign: "center", padding: "32px", color: "var(--clr-text-3)", fontFamily: "var(--font-body)", fontSize: "14px" }}>No eligible orders for return.</div>
                  )}
                </div>
                <button onClick={() => { if (!orderId) { toast.error("Select an order"); return; } setStep(2); }} style={{ padding: "13px 32px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>Continue →</button>
              </div>
            )}

            {step === 2 && (
              <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "32px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "8px" }}>Return Details</h2>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", marginBottom: "24px" }}>Order: <strong style={{ color: "var(--clr-primary)" }}>{orderId}</strong></p>

                {/* Return or Replace */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "10px" }}>Request Type</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {[["return", "🔄 Return & Refund"], ["replace", "🔁 Replace Item"]].map(([v, l]) => (
                      <button key={v} onClick={() => setType(v)} style={{ flex: 1, padding: "12px", border: `1px solid ${type === v ? "var(--clr-primary)" : "var(--clr-border-2)"}`, background: type === v ? "rgba(201,169,110,0.08)" : "transparent", color: type === v ? "var(--clr-primary)" : "var(--clr-text-2)", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: type === v ? 500 : 300, cursor: "pointer", transition: "all 0.2s" }}>{l}</button>
                    ))}
                  </div>
                </div>

                {/* Reason */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "10px" }}>Reason for Return *</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {REASONS.map(r => (
                      <label key={r} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", cursor: "pointer", background: reason === r ? "rgba(201,169,110,0.06)" : "var(--clr-bg-3)", border: `1px solid ${reason === r ? "var(--clr-primary)" : "var(--clr-border-2)"}`, transition: "all 0.2s" }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${reason === r ? "var(--clr-primary)" : "var(--clr-border-2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {reason === r && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--clr-primary)" }} />}
                        </div>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: reason === r ? "var(--clr-primary)" : "var(--clr-text-2)", fontWeight: reason === r ? 400 : 300 }}>{r}</span>
                        <input type="radio" checked={reason === r} onChange={() => setReason(r)} style={{ display: "none" }} />
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(1)} style={{ padding: "13px 20px", background: "transparent", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em" }}>← Back</button>
                  <button onClick={handleSubmit} style={{ flex: 1, padding: "13px 32px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>Submit {type === "return" ? "Return" : "Replacement"} Request</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
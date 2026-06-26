import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { useRewards } from "../context/RewardsContext";
import { useToast } from "../context/ToastContext";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: "💳", desc: "GPay, PhonePe, Paytm, BHIM" },
  { id: "card", label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: "🏦", desc: "All major banks supported" },
  { id: "wallet", label: "Wallets", icon: "👜", desc: "Paytm, Mobikwik, Ola Money" },
  { id: "emi", label: "EMI / Pay Later", icon: "📅", desc: "No-cost EMI available" },
  { id: "cod", label: "Cash on Delivery", icon: "💵", desc: "Pay when you receive" },
];

const SAVED_ADDRESSES = [
  { id: "a1", name: "Priya Sharma", line1: "45, Rose Garden Society, Andheri West", city: "Mumbai", state: "Maharashtra", pincode: "400053", phone: "9876543210", isDefault: true },
  { id: "a2", name: "Priya Sharma", line1: "12, MG Road, Koramangala", city: "Bangalore", state: "Karnataka", pincode: "560034", phone: "9876543210", isDefault: false },
];

function Input({ label, value, onChange, type = "text", placeholder, required }) {
  return (
    <div>
      <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "7px" }}>{label}{required && " *"}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: "100%", padding: "12px 14px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
        onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
    </div>
  );
}

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { points, redeemPoints } = useRewards();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [addressMode, setAddressMode] = useState("saved"); // saved | new
  const [selectedAddress, setSelectedAddress] = useState("a1");
  const [newAddress, setNewAddress] = useState({ name: "", line1: "", line2: "", city: "", state: "", pincode: "", phone: "" });
  const [payment, setPayment] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [usePoints, setUsePoints] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState("");
  const [placing, setPlacing] = useState(false);

  const shipping = cartTotal >= 1499 ? 0 : 99;
  const pointsDiscount = usePoints ? Math.min(points, Math.floor(cartTotal * 0.1)) : 0;
  const finalTotal = cartTotal + shipping - pointsDiscount;

  const activeAddress = addressMode === "saved"
    ? SAVED_ADDRESSES.find(a => a.id === selectedAddress)
    : newAddress;

  const checkPincode = async () => {
    if (pincode.length !== 6) { setPincodeMsg("Enter 6-digit pincode"); return; }
    await new Promise(r => setTimeout(r, 500));
    const serviceable = ["400001", "400053", "560001", "560034", "110001", "600001"].includes(pincode) || pincode.startsWith("4") || pincode.startsWith("5") || pincode.startsWith("1");
    setPincodeMsg(serviceable ? "✓ Delivery available by May 8, 2025" : "✗ Delivery not available at this pincode");
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    if (usePoints) redeemPoints(pointsDiscount);
    const res = await placeOrder(cart, activeAddress, payment, pointsDiscount);
    if (res.success) {
      clearCart();
      toast.success("Order placed successfully! 🎉");
      navigate(`/order-confirmation/${res.orderId}`);
    }
    setPlacing(false);
  };

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px" }}>
        <div style={{ fontSize: "64px", opacity: 0.2 }}>🛒</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "var(--clr-text-2)" }}>Your cart is empty</h2>
        <Link to="/shop" style={{ padding: "12px 28px", background: "var(--clr-primary)", color: "var(--clr-bg)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>Shop Now</Link>
      </div>
    );
  }

  const S = ({ n, label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: step >= n ? "var(--clr-primary)" : "var(--clr-bg-3)",
        border: `2px solid ${step >= n ? "var(--clr-primary)" : "var(--clr-border-2)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600,
        color: step >= n ? "var(--clr-bg)" : "var(--clr-text-muted)",
        flexShrink: 0,
      }}>{step > n ? "✓" : n}</div>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: step === n ? 500 : 300, color: step >= n ? "var(--clr-text)" : "var(--clr-text-muted)", letterSpacing: "0.08em" }}>{label}</span>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)", padding: "48px 40px 80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "40px", fontWeight: 300, color: "var(--clr-text)", marginBottom: "8px" }}>Checkout</h1>
        <Link to="/cart" style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", textDecoration: "none", letterSpacing: "0.08em" }}>← Back to Cart</Link>

        {/* Step Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: "0", margin: "36px 0" }}>
          <S n={1} label="Delivery Address" />
          <div style={{ flex: 1, height: 1, background: step > 1 ? "var(--clr-primary)" : "var(--clr-divider)", margin: "0 12px", transition: "background 0.3s" }} />
          <S n={2} label="Payment" />
          <div style={{ flex: 1, height: 1, background: step > 2 ? "var(--clr-primary)" : "var(--clr-divider)", margin: "0 12px", transition: "background 0.3s" }} />
          <S n={3} label="Review & Place Order" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "40px", alignItems: "start" }}>
          {/* Left: Steps */}
          <div>
            {/* Step 1: Address */}
            {step === 1 && (
              <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "32px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "24px" }}>Delivery Address</h2>

                {/* Mode Toggle */}
                <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                  {[["saved", "Saved Addresses"], ["new", "Add New Address"]].map(([m, l]) => (
                    <button key={m} onClick={() => setAddressMode(m)} style={{
                      padding: "9px 20px", border: `1px solid ${addressMode === m ? "var(--clr-primary)" : "var(--clr-border-2)"}`,
                      background: addressMode === m ? "rgba(201,169,110,0.08)" : "transparent",
                      color: addressMode === m ? "var(--clr-primary)" : "var(--clr-text-3)",
                      fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500,
                      letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.2s",
                    }}>{l}</button>
                  ))}
                </div>

                {addressMode === "saved" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {SAVED_ADDRESSES.map(addr => (
                      <div key={addr.id} onClick={() => setSelectedAddress(addr.id)} style={{
                        padding: "16px 20px", cursor: "pointer",
                        border: `1px solid ${selectedAddress === addr.id ? "var(--clr-primary)" : "var(--clr-border-2)"}`,
                        background: selectedAddress === addr.id ? "rgba(201,169,110,0.06)" : "var(--clr-bg-3)",
                        transition: "all 0.2s",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${selectedAddress === addr.id ? "var(--clr-primary)" : "var(--clr-border-2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {selectedAddress === addr.id && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--clr-primary)" }} />}
                            </div>
                            <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, color: "var(--clr-text)" }}>{addr.name}</span>
                            {addr.isDefault && <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", color: "var(--clr-primary)", border: "1px solid rgba(201,169,110,0.3)", padding: "2px 7px" }}>DEFAULT</span>}
                          </div>
                        </div>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", fontWeight: 300, lineHeight: 1.6, marginLeft: "26px" }}>
                          {addr.line1}, {addr.city}, {addr.state} - {addr.pincode}<br />
                          📞 {addr.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div style={{ gridColumn: "1 / -1" }}><Input label="Full Name" value={newAddress.name} onChange={e => setNewAddress(p => ({ ...p, name: e.target.value }))} placeholder="Priya Sharma" required /></div>
                    <div style={{ gridColumn: "1 / -1" }}><Input label="Address Line 1" value={newAddress.line1} onChange={e => setNewAddress(p => ({ ...p, line1: e.target.value }))} placeholder="House/Flat no., Street" required /></div>
                    <div style={{ gridColumn: "1 / -1" }}><Input label="Address Line 2 (Optional)" value={newAddress.line2} onChange={e => setNewAddress(p => ({ ...p, line2: e.target.value }))} placeholder="Area, Landmark" /></div>
                    <Input label="City" value={newAddress.city} onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))} placeholder="Mumbai" required />
                    <Input label="State" value={newAddress.state} onChange={e => setNewAddress(p => ({ ...p, state: e.target.value }))} placeholder="Maharashtra" required />
                    <Input label="Pincode" value={newAddress.pincode} onChange={e => setNewAddress(p => ({ ...p, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))} placeholder="400001" required />
                    <Input label="Phone Number" value={newAddress.phone} onChange={e => setNewAddress(p => ({ ...p, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))} type="tel" placeholder="9876543210" required />
                  </div>
                )}

                {/* Pincode check */}
                <div style={{ marginTop: "20px" }}>
                  <div style={{ display: "flex", gap: "0", marginBottom: "8px" }}>
                    <input value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Check delivery pincode"
                      style={{ flex: 1, padding: "11px 14px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", borderRight: "none", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none" }} />
                    <button onClick={checkPincode} style={{ padding: "11px 18px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-primary)", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", cursor: "pointer" }}>Check</button>
                  </div>
                  {pincodeMsg && <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: pincodeMsg.startsWith("✓") ? "#7ec88a" : "#e87070" }}>{pincodeMsg}</p>}
                </div>

                <button onClick={() => setStep(2)} style={{ marginTop: "28px", padding: "14px 40px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "32px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "24px" }}>Payment Method</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                  {PAYMENT_METHODS.map(pm => (
                    <div key={pm.id} onClick={() => setPayment(pm.id)} style={{
                      padding: "16px 20px", cursor: "pointer",
                      border: `1px solid ${payment === pm.id ? "var(--clr-primary)" : "var(--clr-border-2)"}`,
                      background: payment === pm.id ? "rgba(201,169,110,0.06)" : "var(--clr-bg-3)",
                      transition: "all 0.2s",
                      display: "flex", alignItems: "center", gap: "14px",
                    }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${payment === pm.id ? "var(--clr-primary)" : "var(--clr-border-2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {payment === pm.id && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--clr-primary)" }} />}
                      </div>
                      <span style={{ fontSize: "20px" }}>{pm.icon}</span>
                      <div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, color: "var(--clr-text)" }}>{pm.label}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", marginTop: "2px" }}>{pm.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {payment === "upi" && (
                  <div style={{ marginBottom: "20px" }}>
                    <Input label="UPI ID" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" />
                  </div>
                )}

                {/* Reward Points */}
                {points > 0 && (
                  <div style={{ padding: "16px", background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.2)", marginBottom: "24px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                      <input type="checkbox" checked={usePoints} onChange={e => setUsePoints(e.target.checked)} style={{ accentColor: "var(--clr-primary)", width: 16, height: 16 }} />
                      <div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "var(--clr-text)" }}>
                          Use Reward Points ({points} pts available)
                        </div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", marginTop: "2px" }}>
                          Save ₹{Math.min(points, Math.floor(cartTotal * 0.1))} on this order
                        </div>
                      </div>
                    </label>
                  </div>
                )}

                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(1)} style={{ padding: "14px 24px", background: "transparent", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.15em" }}>← Back</button>
                  <button onClick={() => setStep(3)} style={{ flex: 1, padding: "14px 40px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "32px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "24px" }}>Review Your Order</h2>

                {/* Address Review */}
                <div style={{ marginBottom: "24px", padding: "16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-primary)" }}>Delivery Address</span>
                    <button onClick={() => setStep(1)} style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-primary)", background: "none", border: "none", cursor: "pointer" }}>Edit</button>
                  </div>
                  {activeAddress && <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-2)", fontWeight: 300, lineHeight: 1.6 }}>
                    {activeAddress.name}<br />{activeAddress.line1}, {activeAddress.city}, {activeAddress.state} - {activeAddress.pincode}<br />📞 {activeAddress.phone}
                  </p>}
                </div>

                {/* Payment Review */}
                <div style={{ marginBottom: "24px", padding: "16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-primary)" }}>Payment</span>
                    <button onClick={() => setStep(2)} style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-primary)", background: "none", border: "none", cursor: "pointer" }}>Edit</button>
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-2)", fontWeight: 300 }}>
                    {PAYMENT_METHODS.find(p => p.id === payment)?.label}
                    {upiId && ` (${upiId})`}
                    {usePoints && ` + ${pointsDiscount} Reward Points`}
                  </p>
                </div>

                {/* Items Review */}
                <div style={{ marginBottom: "24px" }}>
                  {cart.map(item => (
                    <div key={item._id} style={{ display: "flex", gap: "14px", padding: "14px 0", borderBottom: "1px solid var(--clr-divider)" }}>
                      <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: "cover", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--clr-text)" }}>{item.name}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>Qty: {item.qty}</div>
                      </div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--clr-primary)" }}>₹{(item.price * item.qty).toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(2)} style={{ padding: "14px 24px", background: "transparent", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.15em" }}>← Back</button>
                  <button onClick={handlePlaceOrder} disabled={placing} style={{
                    flex: 1, padding: "15px 40px",
                    background: placing ? "var(--clr-bg-3)" : "var(--clr-primary)",
                    color: placing ? "var(--clr-primary)" : "var(--clr-bg)",
                    border: "1px solid var(--clr-primary)", cursor: placing ? "wait" : "pointer",
                    fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600,
                    letterSpacing: "0.2em", textTransform: "uppercase",
                  }}>
                    {placing ? "Placing Order..." : `Place Order · ₹${Math.round(finalTotal).toLocaleString("en-IN")}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div style={{ position: "sticky", top: 92, background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "28px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid var(--clr-divider)" }}>Order Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
              {cart.map(item => (
                <div key={item._id} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", maxWidth: "180px" }}>{item.name} × {item.qty}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-2)", flexShrink: 0 }}>₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--clr-divider)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {[
                { l: "Subtotal", v: `₹${cartTotal.toLocaleString("en-IN")}` },
                { l: "Shipping", v: shipping === 0 ? "FREE" : `₹${shipping}`, c: shipping === 0 ? "#7ec88a" : undefined },
                usePoints && { l: "Reward Points", v: `-₹${pointsDiscount}`, c: "#7ec88a" },
              ].filter(Boolean).map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)" }}>{r.l}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: r.c || "var(--clr-text)" }}>{r.v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "14px", borderTop: "1px solid var(--clr-divider)" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--clr-text-2)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--clr-primary)" }}>₹{Math.round(finalTotal).toLocaleString("en-IN")}</span>
            </div>
            <div style={{ marginTop: "16px", padding: "10px 14px", background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.15)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", lineHeight: 1.6 }}>
                🔒 Secured by 256-bit SSL encryption. Your data is safe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
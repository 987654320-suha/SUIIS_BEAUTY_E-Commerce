import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import ProductCard from "../components/ProductCard";
import { BESTSELLER_PRODUCTS } from "../data/products";

const COUPONS = {
  SUIIS20: { discount: 0.20, label: "20% Off" },
  BEAUTY10: { discount: 0.10, label: "10% Off" },
  FIRST15: { discount: 0.15, label: "15% Off (First Order)" },
  FREESHIP: { discount: 0, shipping: true, label: "Free Shipping" },
};

export default function Cart() {
  const { cart, removeFromCart, updateQty, saveForLater, moveToCart, savedForLater, clearCart, cartTotal, cartSavings } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null);
  const [couponErr, setCouponErr] = useState("");

  const shipping = cartTotal >= 1499 ? 0 : 99;
  const couponDiscount = applied ? Math.round(cartTotal * applied.discount) : 0;
  const finalTotal = cartTotal + (applied?.shipping ? 0 : shipping) - couponDiscount;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) { setApplied({ code, ...COUPONS[code] }); setCouponErr(""); toast.success(`Coupon "${code}" applied — ${COUPONS[code].label}`); }
    else { setCouponErr("Invalid code. Try SUIIS20, BEAUTY10 or FIRST15"); setApplied(null); }
  };

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", textAlign: "center" }}>
        <div style={{ fontSize: "72px", marginBottom: "24px", opacity: 0.2 }}>🛍️</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "40px", fontWeight: 300, color: "var(--clr-text-2)", marginBottom: "12px" }}>Your bag is empty</h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text-3)", marginBottom: "32px", maxWidth: "360px", lineHeight: 1.7 }}>Add luxurious products to your bag and experience the SUIIS difference.</p>
        <Link to="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "15px 40px", background: "var(--clr-primary)", color: "var(--clr-bg)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>Shop Now →</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--clr-primary)", display: "block", marginBottom: "8px" }}>Your Selection</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 300, color: "var(--clr-text)" }}>Shopping Bag <span style={{ fontSize: "0.5em", color: "var(--clr-text-3)", fontFamily: "var(--font-body)", fontWeight: 300 }}>({cart.reduce((s, i) => s + i.qty, 0)} items)</span></h1>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "44px 40px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "48px", alignItems: "start" }}>

          {/* Cart Items */}
          <div>
            {cart.length > 0 && (
              <>
                {/* Column headers */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 140px 80px", gap: "16px", padding: "0 0 14px", borderBottom: "1px solid var(--clr-divider)", marginBottom: "4px" }}>
                  {["Product", "Price", "Quantity", "Total"].map(h => (
                    <span key={h} style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--clr-text-3)" }}>{h}</span>
                  ))}
                </div>

                {cart.map((item, idx) => {
                  const key = item.cartKey || item._id;
                  return (
                    <div key={key} style={{ display: "grid", gridTemplateColumns: "1fr 120px 140px 80px", gap: "16px", alignItems: "center", padding: "22px 0", borderBottom: "1px solid var(--clr-divider)", animation: "fadeIn 0.3s ease" }}>
                      {/* Product */}
                      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                        <Link to={`/product/${item._id}`} style={{ flexShrink: 0 }}>
                          <img src={item.image} alt={item.name} style={{ width: 88, height: 88, objectFit: "cover", border: "1px solid var(--clr-border-2)", transition: "opacity 0.2s" }} onMouseEnter={e => e.target.style.opacity = "0.8"} onMouseLeave={e => e.target.style.opacity = "1"} />
                        </Link>
                        <div>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--clr-primary)", display: "block", marginBottom: "4px" }}>{item.category}</span>
                          <Link to={`/product/${item._id}`} style={{ textDecoration: "none" }}>
                            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "4px", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--clr-primary)"} onMouseLeave={e => e.currentTarget.style.color = "var(--clr-text)"}>{item.name}</h3>
                          </Link>
                          {item.shade && <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", marginBottom: "4px" }}>Shade: {item.shade}</div>}
                          {item.isBestseller && <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--clr-primary)", border: "1px solid rgba(201,169,110,0.3)", padding: "2px 7px" }}>Bestseller</span>}
                          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                            <button onClick={() => { saveForLater(key); toast.info(`${item.name} saved for later`); }} style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.06em", padding: "0", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--clr-primary)"} onMouseLeave={e => e.currentTarget.style.color = "var(--clr-text-3)"}>Save for Later</button>
                            <span style={{ color: "var(--clr-divider)" }}>|</span>
                            <button onClick={() => { removeFromCart(key); toast.info(`${item.name} removed`); }} style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.06em", padding: "0", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#e87070"} onMouseLeave={e => e.currentTarget.style.color = "var(--clr-text-3)"}>Remove</button>
                          </div>
                        </div>
                      </div>
                      {/* Price */}
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 500, color: "var(--clr-primary)" }}>₹{item.price.toLocaleString("en-IN")}</div>
                        {item.originalPrice && item.originalPrice > item.price && <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-muted)", textDecoration: "line-through" }}>₹{item.originalPrice.toLocaleString("en-IN")}</div>}
                      </div>
                      {/* Qty */}
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--clr-border-2)", width: "fit-content" }}>
                        <button onClick={() => updateQty(key, item.qty - 1)} style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "var(--clr-text-2)", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = "var(--clr-primary)"; e.currentTarget.style.background = "var(--clr-bg-3)"; }} onMouseLeave={e => { e.currentTarget.style.color = "var(--clr-text-2)"; e.currentTarget.style.background = "transparent"; }}>−</button>
                        <span style={{ width: 36, textAlign: "center", fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text)", borderLeft: "1px solid var(--clr-border-2)", borderRight: "1px solid var(--clr-border-2)", height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.qty}</span>
                        <button onClick={() => updateQty(key, item.qty + 1)} style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "var(--clr-text-2)", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = "var(--clr-primary)"; e.currentTarget.style.background = "var(--clr-bg-3)"; }} onMouseLeave={e => { e.currentTarget.style.color = "var(--clr-text-2)"; e.currentTarget.style.background = "transparent"; }}>+</button>
                      </div>
                      {/* Total */}
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 500, color: "var(--clr-text)" }}>₹{(item.price * item.qty).toLocaleString("en-IN")}</div>
                    </div>
                  );
                })}

                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "20px" }}>
                  <Link to="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--clr-text-3)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--clr-primary)"} onMouseLeave={e => e.currentTarget.style.color = "var(--clr-text-3)"}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>Continue Shopping
                  </Link>
                  <button onClick={() => { clearCart(); toast.info("Cart cleared"); }} style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--clr-text-muted)", cursor: "pointer", border: "1px solid var(--clr-border-2)", padding: "7px 14px", background: "none", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#e87070"; e.currentTarget.style.color = "#e87070"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.color = "var(--clr-text-muted)"; }}>Clear Bag</button>
                </div>
              </>
            )}

            {/* Saved for Later */}
            {savedForLater.length > 0 && (
              <div style={{ marginTop: "48px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "20px" }}>Saved for Later ({savedForLater.length})</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {savedForLater.map(item => {
                    const key = item.cartKey || item._id;
                    return (
                      <div key={key} style={{ display: "flex", gap: "14px", padding: "16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)" }}>
                        <img src={item.image} alt={item.name} style={{ width: 64, height: 64, objectFit: "cover", flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--clr-text)", marginBottom: "4px" }}>{item.name}</div>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--clr-primary)", marginBottom: "8px" }}>₹{item.price.toLocaleString("en-IN")}</div>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => { moveToCart(key); toast.success("Moved to cart!"); }} style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-primary)", background: "none", border: "1px solid var(--clr-primary)", padding: "5px 14px", cursor: "pointer", letterSpacing: "0.1em" }}>Move to Cart</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* You may also like */}
            {cart.length > 0 && (
              <div style={{ marginTop: "56px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "var(--clr-text)", marginBottom: "24px" }}>You May Also Like</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
                  {BESTSELLER_PRODUCTS.slice(0, 3).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div style={{ position: "sticky", top: 92 }}>
            <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "28px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "24px", paddingBottom: "18px", borderBottom: "1px solid var(--clr-divider)" }}>Order Summary</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "18px" }}>
                {[
                  { l: `Subtotal (${cart.reduce((s, i) => s + i.qty, 0)} items)`, v: `₹${cartTotal.toLocaleString("en-IN")}` },
                  cartSavings > 0 && { l: "Product Discount", v: `-₹${cartSavings.toLocaleString("en-IN")}`, c: "#7ec88a" },
                  applied && { l: `Coupon (${applied.code})`, v: applied.shipping ? "Free Shipping" : `-₹${couponDiscount.toLocaleString("en-IN")}`, c: "#7ec88a" },
                  { l: "Shipping", v: (applied?.shipping || shipping === 0) ? "FREE" : `₹${shipping}`, c: (applied?.shipping || shipping === 0) ? "#7ec88a" : undefined },
                ].filter(Boolean).map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", fontWeight: 300 }}>{row.l}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: row.c || "var(--clr-text)", fontWeight: row.c ? 500 : 400 }}>{row.v}</span>
                  </div>
                ))}
              </div>

              {/* Free shipping progress */}
              {cartTotal < 1499 && !applied?.shipping && (
                <div style={{ marginBottom: "18px", padding: "12px", background: "rgba(201,169,110,0.05)", border: "1px solid rgba(201,169,110,0.2)" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", marginBottom: "8px" }}>Add ₹{(1499 - cartTotal).toLocaleString("en-IN")} more for free shipping 🚚</p>
                  <div style={{ height: 3, background: "var(--clr-bg-3)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${Math.min((cartTotal / 1499) * 100, 100)}%`, background: "var(--clr-primary)", borderRadius: 2, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              )}

              {/* Coupon */}
              <div style={{ marginBottom: "20px" }}>
                {applied ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "rgba(126,200,138,0.06)", border: "1px solid rgba(126,200,138,0.3)" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#7ec88a", fontWeight: 500 }}>✓ {applied.code} — {applied.label}</span>
                    <button onClick={() => { setApplied(null); setCoupon(""); }} style={{ color: "var(--clr-text-3)", fontSize: "17px", background: "none", border: "none", cursor: "pointer" }}>×</button>
                  </div>
                ) : (
                  <>
                    <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "7px" }}>Coupon Code</label>
                    <div style={{ display: "flex" }}>
                      <input value={coupon} onChange={e => { setCoupon(e.target.value); setCouponErr(""); }} onKeyDown={e => e.key === "Enter" && applyCoupon()} placeholder="e.g. SUIIS20" style={{ flex: 1, padding: "11px 14px", background: "var(--clr-bg-3)", border: `1px solid ${couponErr ? "#e87070" : "var(--clr-border-2)"}`, borderRight: "none", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none", textTransform: "uppercase" }} onFocus={e => e.target.style.borderColor = "var(--clr-primary)"} onBlur={e => e.target.style.borderColor = couponErr ? "#e87070" : "var(--clr-border-2)"} />
                      <button onClick={applyCoupon} style={{ padding: "11px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-primary)", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-bg)"; e.currentTarget.style.borderColor = "var(--clr-primary)"; }} onMouseLeave={e => { e.currentTarget.style.background = "var(--clr-bg-3)"; e.currentTarget.style.color = "var(--clr-primary)"; e.currentTarget.style.borderColor = "var(--clr-border-2)"; }}>Apply</button>
                    </div>
                    {couponErr && <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#e87070", marginTop: "5px" }}>{couponErr}</p>}
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-muted)", marginTop: "6px" }}>Try: SUIIS20, BEAUTY10, FIRST15, FREESHIP</p>
                  </>
                )}
              </div>

              {/* Total */}
              <div style={{ borderTop: "1px solid var(--clr-divider)", paddingTop: "18px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-2)" }}>Total</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 500, color: "var(--clr-primary)" }}>₹{Math.round(finalTotal).toLocaleString("en-IN")}</span>
                </div>
                {(cartSavings + couponDiscount) > 0 && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#7ec88a", textAlign: "right", marginTop: "4px" }}>
                    You're saving ₹{Math.round(cartSavings + couponDiscount).toLocaleString("en-IN")}!
                  </p>
                )}
              </div>

              <Link to="/checkout" style={{ display: "block", width: "100%", padding: "16px", background: "var(--clr-primary)", color: "var(--clr-bg)", textAlign: "center", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", transition: "background 0.3s", marginBottom: "12px" }} onMouseEnter={e => e.currentTarget.style.background = "var(--clr-primary-light)"} onMouseLeave={e => e.currentTarget.style.background = "var(--clr-primary)"}>
                🔒 Proceed to Checkout
              </Link>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-muted)", textAlign: "center", lineHeight: 1.6 }}>
                Secure 256-bit SSL encryption
              </p>
              <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "12px", flexWrap: "wrap" }}>
                {["VISA", "MC", "UPI", "GPay", "PhonePe", "COD"].map(p => (
                  <span key={p} style={{ padding: "2px 7px", border: "1px solid var(--clr-border-2)", fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 600, color: "var(--clr-text-muted)", letterSpacing: "0.06em" }}>{p}</span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "14px", padding: "16px", background: "rgba(201,169,110,0.05)", border: "1px solid rgba(201,169,110,0.15)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", lineHeight: 1.6 }}>
                ✨ <strong style={{ color: "var(--clr-primary)" }}>SUIIS Circle members</strong> get 15% off every order. <Link to="/login" style={{ color: "var(--clr-primary)" }}>Join free →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
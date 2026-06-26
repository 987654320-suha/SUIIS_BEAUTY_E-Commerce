import React from "react";
import { Link } from "react-router-dom";
import { useWishlist, useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const moveAllToCart = () => {
    wishlist.forEach(p => addToCart(p));
    clearWishlist();
    toast.success(`${wishlist.length} items moved to cart! 🛍️`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "14px", fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", letterSpacing: "0.06em" }}>
            <Link to="/" style={{ color: "var(--clr-text-3)", textDecoration: "none" }}>Home</Link><span>/</span><span style={{ color: "var(--clr-text-2)" }}>Wishlist</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 300, color: "var(--clr-text)" }}>My Wishlist</h1>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", marginTop: "4px" }}>{wishlist.length} saved items</p>
            </div>
            {wishlist.length > 0 && (
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={moveAllToCart} style={{ padding: "11px 22px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", transition: "background 0.25s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--clr-primary-light)"} onMouseLeave={e => e.currentTarget.style.background = "var(--clr-primary)"}>
                  Move All to Bag
                </button>
                <button onClick={() => { clearWishlist(); toast.info("Wishlist cleared"); }} style={{ padding: "11px 18px", background: "transparent", color: "var(--clr-text-3)", border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#e87070"; e.currentTarget.style.color = "#e87070"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.color = "var(--clr-text-3)"; }}>
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "44px 40px 80px" }}>
        {wishlist.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "72px", marginBottom: "24px", opacity: 0.2 }}>❤️</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: 300, color: "var(--clr-text-2)", marginBottom: "12px" }}>Your wishlist is empty</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text-3)", marginBottom: "32px", maxWidth: "360px", margin: "0 auto 32px", lineHeight: 1.7 }}>Save your favourite products to buy later. Click the heart icon on any product.</p>
            <Link to="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "15px 40px", background: "var(--clr-primary)", color: "var(--clr-bg)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Discover Products →
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {wishlist.map((product, i) => (
              <div key={product._id} style={{ position: "relative" }}>
                <ProductCard product={product} index={i} />
                <button onClick={() => { toggleWishlist(product); toast.info("Removed from wishlist"); }} style={{ position: "absolute", top: 12, right: 12, width: 28, height: 28, borderRadius: "50%", background: "rgba(232,112,112,0.15)", border: "1px solid rgba(232,112,112,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#e87070", fontSize: "14px", zIndex: 2 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
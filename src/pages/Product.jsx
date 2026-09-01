import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart, useWishlist } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";
import { getProductById, getRelatedProducts } from "../data/products";
import ProductCard from "../components/ProductCard";

const TABS = ["Description", "Benefits", "Ingredients", "How to Use", "Reviews"];

const MOCK_REVIEWS = [
  { name: "Priya S.", city: "Mumbai", rating: 5, date: "March 2025", text: "Absolutely stunning! The quality is outstanding and it lasts all day without any fading. This is my holy grail product.", verified: true, likes: 24 },
  { name: "Ananya M.", city: "Bangalore", rating: 5, date: "February 2025", text: "Best purchase this year. Buttery smooth, highly pigmented, gorgeous packaging. Worth every rupee!", verified: true, likes: 18 },
  { name: "Divya R.", city: "Delhi", rating: 4, date: "January 2025", text: "Great product overall. Very pigmented and long-lasting. Shipping was super fast too.", verified: true, likes: 9 },
  { name: "Komal T.", city: "Pune", rating: 5, date: "December 2024", text: "Exceeded all my expectations! The colour payoff is phenomenal. Already on my third repurchase.", verified: true, likes: 31 },
];

function Stars({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < Math.floor(rating) ? "var(--clr-primary)" : "none"} stroke="var(--clr-primary)" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();
  const { addToRecentlyViewed } = useRecentlyViewed();

  const product = getProductById(id);
  const related = product ? getRelatedProducts(product, 4) : [];

  const [selectedShade, setSelectedShade] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState(null);
  const [arOpen, setArOpen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("latest");
  const [likedReviews, setLikedReviews] = useState({});
  const imgRef = useRef(null);

  const wishlisted = isWishlisted(id);
  const images = product?.gallery?.length ? product.gallery : [product?.image];
  const discount = product?.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  useEffect(() => {
    if (product) { addToRecentlyViewed(product); setSelectedShade(0); setQty(1); setActiveTab("Description"); setActiveImage(0); }
  }, [id, product]);

  if (!product) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
        <div style={{ fontSize: "64px", opacity: 0.2 }}>🔍</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 300, color: "var(--clr-text-2)" }}>Product Not Found</h2>
        <Link to="/shop" style={{ padding: "12px 28px", background: "var(--clr-primary)", color: "var(--clr-bg)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setAdding(true);
    addToCart(product, qty, product.shades?.[selectedShade] || null);
    toast.success(`${product.name} added to your bag! 💄`);
    setTimeout(() => setAdding(false), 1200);
  };

  const handleZoom = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const checkPincode = async () => {
    if (pincode.length !== 6) { setPincodeResult({ ok: false, msg: "Enter valid 6-digit pincode" }); return; }
    await new Promise(r => setTimeout(r, 500));
    const ok = parseInt(pincode) > 100000;
    setPincodeResult({ ok, msg: ok ? `✓ Delivery available by ${new Date(Date.now() + 4 * 86400000).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}` : "✗ Delivery not available at this pincode" });
  };

  const tabContent = {
    Description: (
      <div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 300, color: "var(--clr-text-2)", lineHeight: 1.85, marginBottom: "20px" }}>{product.description}</p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 300, color: "var(--clr-text-2)", lineHeight: 1.85 }}>Each SUIIS formula is developed over 18+ months by our expert cosmetic chemists, tested on a diverse panel of skin tones, and quality-verified to meet international safety standards. Dermatologist tested. Ophthalmologist approved where applicable.</p>
        {product.tags && (<div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "20px" }}>{product.tags.map(t => <span key={t} style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.1em", color: "var(--clr-text-3)", border: "1px solid var(--clr-border-2)", padding: "3px 10px" }}>#{t}</span>)}</div>)}
      </div>
    ),
    Benefits: (
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
        {(product.benefits || ["Luxurious formula", "Long-lasting colour", "Highly pigmented", "Comfortable wear", "Cruelty free"]).map((b, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
            <div style={{ width: 22, height: 22, border: "1px solid var(--clr-primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 300, color: "var(--clr-text-2)", lineHeight: 1.6 }}>{b}</span>
          </li>
        ))}
      </ul>
    ),
    Ingredients: (
      <div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 300, color: "var(--clr-text-3)", lineHeight: 1.75, marginBottom: "16px" }}>
          <strong style={{ color: "var(--clr-text-2)", fontWeight: 500 }}>Full Ingredients (INCI):</strong><br />
          Aqua, Cyclopentasiloxane, Dimethicone, Isododecane, Trisiloxane, Nylon-12, Beeswax (Cera Alba), Carnauba Wax (Copernicia Cerifera), Caprylic/Capric Triglyceride, Tocopheryl Acetate (Vitamin E), Rosa Damascena Flower Oil, Argania Spinosa Kernel Oil (Argan), Sodium Hyaluronate (Hyaluronic Acid), Niacinamide, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Titanium Dioxide (CI 77891), Iron Oxides (CI 77491, CI 77492, CI 77499).
        </p>
        <div style={{ padding: "16px", background: "rgba(201,169,110,0.05)", border: "1px solid var(--clr-border)" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--clr-primary)" }}>Free From:</strong> Parabens · Sulfates · Mineral Oil · Synthetic Fragrance · Phthalates · Formaldehyde · Talc · Lead · Bismuth Oxychloride
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
          {["Vegan", "Cruelty Free", "Dermatologist Tested", "Clean Beauty", "PETA Certified"].map(b => (
            <span key={b} style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7ec88a", border: "1px solid rgba(126,200,138,0.3)", padding: "4px 10px", background: "rgba(126,200,138,0.06)" }}>✓ {b}</span>
          ))}
        </div>
      </div>
    ),
    "How to Use": (
      <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "18px" }}>
        {["Prep your skin — cleanse, tone, and moisturise.", "Apply our Silk Hydrating Primer for an extended-wear base.", "Apply the product using the included applicator or a SUIIS brush.", "Build layers for desired intensity — blend outward for a seamless finish.", "Lock in your look with SUIIS Mist & Fix Setting Spray.", "Enjoy up to 16 hours of flawless colour!"].map((step, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <span style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "14px", color: "var(--clr-primary)", fontWeight: 500, flexShrink: 0 }}>{i + 1}</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 300, color: "var(--clr-text-2)", lineHeight: 1.7, paddingTop: "4px" }}>{step}</span>
          </li>
        ))}
      </ol>
    ),
    Reviews: (
      <div>
        {/* Rating Summary */}
        <div style={{ padding: "24px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", marginBottom: "24px", display: "flex", gap: "40px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "56px", fontWeight: 300, color: "var(--clr-primary)", lineHeight: 1 }}>{product.rating}</div>
            <Stars rating={product.rating} size={16} />
            <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", marginTop: "4px" }}>{product.reviews} reviews</div>
          </div>
          <div style={{ flex: 1, minWidth: "200px" }}>
            {[5, 4, 3, 2, 1].map(star => {
              const pct = star === 5 ? 75 : star === 4 ? 18 : star === 3 ? 5 : 1;
              return (
                <div key={star} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", width: 14, flexShrink: 0 }}>{star}★</span>
                  <div style={{ flex: 1, height: 4, background: "var(--clr-bg-2)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "var(--clr-primary)", borderRadius: 2 }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", width: 30, flexShrink: 0 }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Sort Reviews */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {["latest", "highest", "lowest", "helpful"].map(f => (
            <button key={f} onClick={() => setReviewFilter(f)} style={{ padding: "5px 14px", border: `1px solid ${reviewFilter === f ? "var(--clr-primary)" : "var(--clr-border-2)"}`, background: reviewFilter === f ? "rgba(201,169,110,0.1)" : "transparent", color: reviewFilter === f ? "var(--clr-primary)" : "var(--clr-text-3)", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, cursor: "pointer", textTransform: "capitalize", letterSpacing: "0.06em" }}>{f}</button>
          ))}
        </div>
        {/* Reviews list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {MOCK_REVIEWS.map((r, i) => (
            <div key={i} style={{ padding: "24px", background: "var(--clr-bg-card)", border: "1px solid var(--clr-border-2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, color: "var(--clr-text)" }}>{r.name}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>· {r.city}</span>
                    {r.verified && <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7ec88a", background: "rgba(126,200,138,0.1)", padding: "2px 7px" }}>✓ Verified</span>}
                  </div>
                  <Stars rating={r.rating} size={12} />
                </div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>{r.date}</span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 300, color: "var(--clr-text-2)", lineHeight: 1.7, marginBottom: "14px" }}>{r.text}</p>
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setLikedReviews(p => ({ ...p, [i]: !p[i] }))} style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: likedReviews[i] ? "var(--clr-primary)" : "var(--clr-text-3)", background: "none", border: `1px solid ${likedReviews[i] ? "var(--clr-primary)" : "var(--clr-border-2)"}`, padding: "4px 12px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "5px" }}>
                  👍 {r.likes + (likedReviews[i] ? 1 : 0)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)" }}>
      {/* Breadcrumb */}
      <div style={{ borderBottom: "1px solid var(--clr-divider)", padding: "13px 40px", background: "var(--clr-bg-2)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", gap: "6px", alignItems: "center", fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", letterSpacing: "0.06em", flexWrap: "wrap" }}>
          {[["Home", "/"], ["Shop", "/shop"], [product.category, `/shop/${product.category}`]].map(([l, p]) => (
            <React.Fragment key={l}><Link to={p} style={{ color: "var(--clr-text-3)", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.color = "var(--clr-primary)"} onMouseLeave={e => e.currentTarget.style.color = "var(--clr-text-3)"}>{l}</Link><span>/</span></React.Fragment>
          ))}
          <span style={{ color: "var(--clr-text-2)" }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "52px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start" }}>

          {/* LEFT: Images */}
          <div style={{ position: "sticky", top: 92 }}>
            {/* Main Image with Zoom */}
            <div ref={imgRef} style={{ position: "relative", overflow: "hidden", aspectRatio: "4/5", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", marginBottom: "10px", cursor: zoomed ? "zoom-out" : "zoom-in" }}
              onClick={() => setZoomed(z => !z)}
              onMouseMove={handleZoom}
              onMouseLeave={() => setZoomed(false)}>
              <img src={images[activeImage]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease", transformOrigin: zoomed ? `${zoomPos.x}% ${zoomPos.y}%` : "center", transform: zoomed ? "scale(2)" : "scale(1)" }} />
              {/* Badges */}
              <div style={{ position: "absolute", top: 14, left: 14, display: "flex", flexDirection: "column", gap: "6px" }}>
                {product.isNew && <span style={{ background: "var(--clr-accent)", color: "var(--clr-bg)", fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", padding: "5px 11px" }}>New</span>}
                {discount > 0 && <span style={{ background: "rgba(126,200,138,0.9)", color: "var(--clr-bg)", fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 600, padding: "5px 11px" }}>−{discount}%</span>}
              </div>
              {/* Wishlist */}
              <button onClick={e => { e.stopPropagation(); toggleWishlist(product); toast.info(wishlisted ? "Removed from wishlist" : "Saved to wishlist"); }} style={{ position: "absolute", top: 14, right: 14, width: 40, height: 40, borderRadius: "50%", background: "rgba(10,10,10,0.75)", backdropFilter: "blur(8px)", border: `1px solid ${wishlisted ? "var(--clr-accent)" : "rgba(255,255,255,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? "var(--clr-accent)" : "none"} stroke={wishlisted ? "var(--clr-accent)" : "white"} strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              </button>
              {/* Zoom hint */}
              <div style={{ position: "absolute", bottom: 12, right: 12, fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", pointerEvents: "none" }}>
                {zoomed ? "Click to zoom out" : "Click to zoom in"}
              </div>
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: "flex", gap: "8px" }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} style={{ width: 70, height: 70, overflow: "hidden", border: `2px solid ${activeImage === i ? "var(--clr-primary)" : "var(--clr-border-2)"}`, cursor: "pointer", padding: 0, background: "none", transition: "border-color 0.2s", flexShrink: 0 }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
            {/* AR Try-On Button */}
            <button onClick={() => setArOpen(true)} style={{ width: "100%", marginTop: "12px", padding: "12px", border: "1px solid var(--clr-border-2)", background: "var(--clr-bg-3)", color: "var(--clr-text-2)", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-primary)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.color = "var(--clr-text-2)"; }}>
              ✨ Virtual Try-On (AR)
            </button>
          </div>

          {/* RIGHT: Product Info */}
          <div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--clr-primary)", display: "block", marginBottom: "10px" }}>{product.category} · {product.subcategory}</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 300, lineHeight: 1.1, color: "var(--clr-text)", marginBottom: "14px" }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
              <Stars rating={product.rating} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)" }}>{product.rating} · {product.reviews} reviews</span>
              <button onClick={() => setActiveTab("Reviews")} style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Read reviews →</button>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px", paddingBottom: "28px", borderBottom: "1px solid var(--clr-divider)" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "34px", fontWeight: 500, color: "var(--clr-primary)" }}>₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && <><span style={{ fontFamily: "var(--font-body)", fontSize: "17px", color: "var(--clr-text-muted)", textDecoration: "line-through" }}>₹{product.originalPrice.toLocaleString("en-IN")}</span><span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, color: "#7ec88a", background: "rgba(126,200,138,0.1)", padding: "4px 10px" }}>Save ₹{(product.originalPrice - product.price).toLocaleString("en-IN")} ({discount}%)</span></>}
            </div>

            {/* Shades */}
            {product.shades?.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", marginBottom: "10px" }}>
                  Shade: <span style={{ color: "var(--clr-text)", fontWeight: 400 }}>{product.shades[selectedShade]}</span>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {product.shades.map((shade, i) => (
                    <button key={i} onClick={() => setSelectedShade(i)} title={shade} style={{ width: 28, height: 28, borderRadius: "50%", background: shade, border: selectedShade === i ? "2px solid var(--clr-primary)" : "2px solid transparent", outline: selectedShade === i ? "2px solid rgba(201,169,110,0.4)" : "2px solid transparent", outlineOffset: "2px", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }} />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: "22px" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", marginBottom: "10px" }}>Quantity</div>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--clr-border-2)", width: "fit-content" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "var(--clr-text-2)", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = "var(--clr-primary)"; e.currentTarget.style.background = "var(--clr-bg-3)"; }} onMouseLeave={e => { e.currentTarget.style.color = "var(--clr-text-2)"; e.currentTarget.style.background = "transparent"; }}>−</button>
                <span style={{ width: 48, textAlign: "center", fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--clr-text)", borderLeft: "1px solid var(--clr-border-2)", borderRight: "1px solid var(--clr-border-2)", height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "var(--clr-text-2)", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = "var(--clr-primary)"; e.currentTarget.style.background = "var(--clr-bg-3)"; }} onMouseLeave={e => { e.currentTarget.style.color = "var(--clr-text-2)"; e.currentTarget.style.background = "transparent"; }}>+</button>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: product.stock < 10 ? "#e87070" : "var(--clr-text-3)", marginTop: "7px", letterSpacing: "0.04em" }}>
                {product.stock < 10 ? `⚠ Only ${product.stock} left!` : `${product.stock} in stock`}
              </p>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
              <button onClick={handleAddToCart} disabled={adding} style={{ width: "100%", padding: "16px", background: adding ? "var(--clr-bg-3)" : "var(--clr-primary)", color: adding ? "var(--clr-primary)" : "var(--clr-bg)", border: "1px solid var(--clr-primary)", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", cursor: adding ? "default" : "pointer", transition: "all 0.35s", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} onMouseEnter={e => { if (!adding) e.currentTarget.style.background = "var(--clr-primary-light)"; }} onMouseLeave={e => { if (!adding) e.currentTarget.style.background = "var(--clr-primary)"; }}>
                {adding ? (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Added!</>) : "Add to Bag"}
              </button>
              <button onClick={() => { addToCart(product, qty); navigate("/checkout"); }} style={{ width: "100%", padding: "16px", background: "transparent", color: "var(--clr-text)", border: "1px solid var(--clr-border)", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.35s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-primary)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border)"; e.currentTarget.style.color = "var(--clr-text)"; }}>Buy Now</button>
            </div>

            {/* Delivery Check */}
            <div style={{ padding: "18px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", marginBottom: "24px" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", marginBottom: "10px" }}>🚚 Check Delivery</div>
              <div style={{ display: "flex", gap: "0" }}>
                <input value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} onKeyDown={e => e.key === "Enter" && checkPincode()} placeholder="Enter pincode" style={{ flex: 1, padding: "10px 14px", background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", borderRight: "none", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none" }} />
                <button onClick={checkPincode} style={{ padding: "10px 18px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", cursor: "pointer", flexShrink: 0 }}>Check</button>
              </div>
              {pincodeResult && <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: pincodeResult.ok ? "#7ec88a" : "#e87070", marginTop: "8px" }}>{pincodeResult.msg}</p>}
            </div>

            {/* Trust Signals */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--clr-divider)", border: "1px solid var(--clr-divider)", marginBottom: "24px" }}>
              {[["🚚", "Free Shipping", "Above ₹1,499"], ["↩", "15-Day Returns", "Hassle-free"], ["🔒", "Secure Payment", "256-bit SSL"]].map(([ic, t, s]) => (
                <div key={t} style={{ padding: "14px 10px", background: "var(--clr-bg-3)", textAlign: "center" }}>
                  <div style={{ fontSize: "18px", marginBottom: "5px" }}>{ic}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, color: "var(--clr-text)", marginBottom: "2px" }}>{t}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-3)" }}>{s}</div>
                </div>
              ))}
            </div>

            {/* Offers */}
            <div style={{ border: "1px solid var(--clr-border-2)", padding: "18px", background: "rgba(201,169,110,0.03)" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-primary)", marginBottom: "12px" }}>🎟 Available Offers</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {["Use code SUIIS20 — Get 20% off", "Earn 85 reward points on this purchase", "No-cost EMI available from ₹300/month", "Buy 2 get 10% extra off"].map(o => (
                  <div key={o} style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#7ec88a", flexShrink: 0 }}>✓</span>{o}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop: "80px", borderTop: "1px solid var(--clr-divider)", paddingTop: "60px" }}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--clr-divider)", marginBottom: "36px", overflowX: "auto" }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "14px 24px", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: activeTab === tab ? "var(--clr-primary)" : "var(--clr-text-3)", marginBottom: "-1px", cursor: "pointer", transition: "all 0.25s", background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab ? "var(--clr-primary)" : "transparent"}`, whiteSpace: "nowrap" }}>{tab}</button>
            ))}
          </div>
          <div style={{ maxWidth: "720px" }}>{tabContent[activeTab]}</div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: "96px" }}>
            <div style={{ marginBottom: "36px" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--clr-primary)", display: "block", marginBottom: "10px" }}>You May Also Like</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: 300, color: "var(--clr-text)" }}>Related Products</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>

      {/* AR Try-On Modal */}
      {arOpen && (
        <div onClick={() => setArOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border)", width: "min(480px, 100%)", padding: "40px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✨</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "var(--clr-text)", marginBottom: "12px" }}>Virtual Try-On</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text-3)", lineHeight: 1.7, marginBottom: "24px" }}>
              Our AR try-on feature lets you see how <strong style={{ color: "var(--clr-primary)" }}>{product.name}</strong> looks on you in real time using your camera. Experience the colour before you buy!
            </p>
            <div style={{ background: "var(--clr-bg-3)", border: "2px dashed var(--clr-border)", padding: "40px", marginBottom: "24px", borderRadius: "4px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📷</div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)" }}>Camera access required<br /><span style={{ fontSize: "11px", color: "var(--clr-text-muted)" }}>(Feature coming soon in the app)</span></p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => { toast.info("AR Try-On launching soon! 🚀"); setArOpen(false); }} style={{ flex: 1, padding: "13px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>Launch Camera</button>
              <button onClick={() => setArOpen(false)} style={{ padding: "13px 20px", background: "transparent", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px" }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
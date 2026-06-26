import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart, useWishlist } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();
  const wishlisted = isWishlisted(product._id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(product);
    toast.success(`${product.name} added to bag`);
    setTimeout(() => setAdding(false), 1200);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast.info(
      wishlisted
        ? `Removed from wishlist`
        : `${product.name} saved to wishlist`
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        width="10" height="10" viewBox="0 0 24 24"
        fill={i < Math.floor(rating) ? "var(--clr-primary)" : "none"}
        stroke="var(--clr-primary)"
        strokeWidth="1.5"
        style={{ display: "inline-block" }}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ));
  };

  return (
    <Link
      to={`/product/${product._id}`}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <article
        style={{
          background: "var(--clr-bg-card)",
          border: "1px solid var(--clr-border-2)",
          overflow: "hidden",
          transition: "all 0.4s var(--ease-smooth)",
          borderColor: hovered ? "var(--clr-border)" : "var(--clr-border-2)",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hovered ? "var(--shadow-md)" : "none",
          animationDelay: `${index * 0.07}s`,
        }}
      >
        {/* Image Container */}
        <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4" }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.6s var(--ease-smooth)",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }}
          />

          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
          }} />

          {/* Badges */}
          <div style={{
            position: "absolute", top: 12, left: 12,
            display: "flex", flexDirection: "column", gap: "6px",
          }}>
            {product.isNew && (
              <span style={{
                background: "var(--clr-accent)",
                color: "var(--clr-bg)",
                fontFamily: "var(--font-body)",
                fontSize: "9px", fontWeight: 600,
                letterSpacing: "0.15em", textTransform: "uppercase",
                padding: "4px 10px",
              }}>New</span>
            )}
            {product.isBestseller && (
              <span style={{
                background: "var(--clr-primary)",
                color: "var(--clr-bg)",
                fontFamily: "var(--font-body)",
                fontSize: "9px", fontWeight: 600,
                letterSpacing: "0.15em", textTransform: "uppercase",
                padding: "4px 10px",
              }}>Bestseller</span>
            )}
            {discount > 0 && (
              <span style={{
                background: "rgba(126,200,138,0.9)",
                color: "var(--clr-bg)",
                fontFamily: "var(--font-body)",
                fontSize: "9px", fontWeight: 600,
                letterSpacing: "0.1em",
                padding: "4px 10px",
              }}>−{discount}%</span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            style={{
              position: "absolute", top: 12, right: 12,
              width: 36, height: 36,
              background: "rgba(10,10,10,0.7)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${wishlisted ? "var(--clr-accent)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: hovered || wishlisted ? 1 : 0,
              transform: hovered || wishlisted ? "scale(1)" : "scale(0.8)",
              transition: "all 0.3s var(--ease-bounce)",
              cursor: "pointer",
            }}
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24"
              fill={wishlisted ? "var(--clr-accent)" : "none"}
              stroke={wishlisted ? "var(--clr-accent)" : "var(--clr-text-2)"}
              strokeWidth="1.5"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Quick Add button */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.4s var(--ease-out-expo)",
          }}>
            <button
              onClick={handleAddToCart}
              style={{
                width: "100%", padding: "13px",
                background: adding ? "var(--clr-bg-3)" : "rgba(10,10,10,0.92)",
                backdropFilter: "blur(10px)",
                border: "1px solid var(--clr-border)",
                borderBottom: "none",
                color: adding ? "var(--clr-primary)" : "var(--clr-text)",
                fontFamily: "var(--font-body)",
                fontSize: "10px", fontWeight: 500,
                letterSpacing: "0.2em", textTransform: "uppercase",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "all 0.3s ease",
              }}
            >
              {adding ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Added to Bag
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  Quick Add
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: "16px" }}>
          {/* Category */}
          <div style={{
            fontFamily: "var(--font-body)", fontSize: "9px",
            fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase",
            color: "var(--clr-primary)", marginBottom: "6px",
          }}>
            {product.category}
            {product.subcategory && ` · ${product.subcategory}`}
          </div>

          {/* Name */}
          <h3 style={{
            fontFamily: "var(--font-display)", fontSize: "17px",
            fontWeight: 400, color: "var(--clr-text)",
            marginBottom: "8px", lineHeight: 1.2,
            transition: "color 0.2s",
            ...(hovered ? { color: "var(--clr-primary-light)" } : {}),
          }}>
            {product.name}
          </h3>

          {/* Rating */}
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            marginBottom: "12px",
          }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {renderStars(product.rating)}
            </div>
            <span style={{
              fontFamily: "var(--font-body)", fontSize: "11px",
              color: "var(--clr-text-3)",
            }}>
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: "20px",
              fontWeight: 500, color: "var(--clr-primary)",
            }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{
                fontFamily: "var(--font-body)", fontSize: "13px",
                color: "var(--clr-text-muted)", textDecoration: "line-through",
              }}>
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Shade dots if available */}
          {product.shades && product.shades.length > 0 && (
            <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
              {product.shades.slice(0, 5).map((shade, i) => (
                <div
                  key={i}
                  style={{
                    width: 12, height: 12, borderRadius: "50%",
                    background: shade,
                    border: "1px solid rgba(255,255,255,0.15)",
                    flexShrink: 0,
                  }}
                />
              ))}
              {product.shades.length > 5 && (
                <span style={{
                  fontFamily: "var(--font-body)", fontSize: "10px",
                  color: "var(--clr-text-3)", alignSelf: "center",
                }}>+{product.shades.length - 5}</span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
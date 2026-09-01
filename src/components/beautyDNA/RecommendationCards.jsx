import React from "react";
import { Link } from "react-router-dom";

export default function RecommendationCards({ products = [] }) {
  if (!products.length) return null;

  return (
    <div style={{ marginTop: "8px" }}>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "10px",
          fontWeight: 500,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--clr-primary)",
          display: "block",
          marginBottom: "10px",
        }}
      >
        Personalized For You
      </span>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "28px",
          fontWeight: 300,
          color: "var(--clr-text)",
          marginBottom: "24px",
        }}
      >
        🛍️ AI Recommended Products
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {products.map((p, i) => (
          <div
            key={p._id || i}
            style={{
              background: "var(--clr-bg-card)",
              border: "1px solid var(--clr-border-2)",
              overflow: "hidden",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--clr-border)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--clr-border-2)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  background: "var(--clr-primary)",
                  color: "var(--clr-bg)",
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  padding: "4px 10px",
                }}
              >
                ⭐ {p.match} Match
              </span>
            </div>

            <div style={{ padding: "18px" }}>
              {p.category && (
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "9px",
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--clr-primary)",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  {p.category}
                </span>
              )}
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "17px",
                  fontWeight: 400,
                  color: "var(--clr-text)",
                  marginBottom: "10px",
                  lineHeight: 1.3,
                }}
              >
                {p.name}
              </h3>

              {p.price && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "18px",
                      fontWeight: 500,
                      color: "var(--clr-primary)",
                    }}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                  {p.originalPrice && (
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "12px",
                        color: "var(--clr-text-muted)",
                        textDecoration: "line-through",
                      }}
                    >
                      ₹{p.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              )}

              <Link
                to={p._id ? `/product/${p._id}` : "/shop"}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "11px",
                  textAlign: "center",
                  background: "var(--clr-primary)",
                  color: "var(--clr-bg)",
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  transition: "background 0.25s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--clr-primary-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--clr-primary)")}
              >
                View Product
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

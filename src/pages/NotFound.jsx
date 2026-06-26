import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: "500px" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(80px, 15vw, 140px)", fontWeight: 300, color: "var(--clr-primary)", opacity: 0.2, lineHeight: 1, marginBottom: "8px" }}>404</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 300, color: "var(--clr-text)", marginBottom: "14px" }}>Page Not Found</h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 300, color: "var(--clr-text-3)", lineHeight: 1.75, marginBottom: "36px" }}>
          The page you're looking for has moved, been removed, or doesn't exist. Let's get you back to something beautiful.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate(-1)} style={{ padding: "13px 28px", background: "transparent", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", transition: "all 0.25s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-primary)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.color = "var(--clr-text-2)"; }}>← Go Back</button>
          <Link to="/" style={{ padding: "13px 28px", background: "var(--clr-primary)", color: "var(--clr-bg)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", transition: "background 0.25s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--clr-primary-light)"} onMouseLeave={e => e.currentTarget.style.background = "var(--clr-primary)"}>Home</Link>
          <Link to="/shop" style={{ padding: "13px 28px", background: "transparent", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", transition: "all 0.25s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-primary)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.color = "var(--clr-text-2)"; }}>Shop</Link>
        </div>
      </div>
    </div>
  );
}
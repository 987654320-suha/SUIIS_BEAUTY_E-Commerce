// ============================================================
// SUIIS BEAUTY - Floating "Talk to Beauty Expert" Button
// Visible globally across the entire website with gold aura glow.
// ============================================================

import React from "react";

export default function FloatingVoiceButton({ onClick, isOpen = false }) {
  if (isOpen) return null; // hide button when modal is open

  return (
    <button
      onClick={onClick}
      aria-label="Talk to Beauty Expert"
      style={{
        position: "fixed",
        bottom: "32px",
        left: "32px",
        zIndex: 8500,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 24px",
        background: "rgba(20, 20, 20, 0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(201, 169, 110, 0.45)",
        borderRadius: "9999px",
        color: "var(--clr-text)",
        cursor: "pointer",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(201, 169, 110, 0.25)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 16px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(201, 169, 110, 0.45)";
        e.currentTarget.style.borderColor = "var(--clr-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(201, 169, 110, 0.25)";
        e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.45)";
      }}
    >
      {/* Animated Glowing Mic Orb */}
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #e8c998 0%, #c9a96e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 15px rgba(201, 169, 110, 0.6)",
          color: "#0a0a0a",
          fontSize: "16px",
        }}
      >
        🎙️
      </div>

      <div style={{ textAlign: "left" }}>
        <span
          style={{
            display: "block",
            fontSize: "9px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--clr-primary)",
            fontWeight: 600,
            fontFamily: "var(--font-body)",
          }}
        >
          Suiis Voice AI
        </span>
        <span
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--clr-text)",
            fontFamily: "var(--font-body)",
            letterSpacing: "0.02em",
          }}
        >
          Talk to Beauty Expert
        </span>
      </div>

      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#4ade80",
          boxShadow: "0 0 10px #4ade80",
          marginLeft: "4px",
        }}
      />
    </button>
  );
}

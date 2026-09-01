import React from "react";

export default function BeautyScore({ score = 0 }) {
  const tier =
    score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Fair" : "Needs Care";

  const tierColor =
    score >= 85 ? "#7ec88a" : score >= 70 ? "var(--clr-primary)" : score >= 50 ? "#e8a0b4" : "#e87070";

  return (
    <div
      style={{
        background: "var(--clr-bg-2)",
        border: "1px solid var(--clr-border-2)",
        borderRadius: "4px",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "10px",
          fontWeight: 500,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--clr-primary)",
          display: "block",
          marginBottom: "8px",
        }}
      >
        AI Analysis Complete
      </span>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "28px",
          fontWeight: 300,
          color: "var(--clr-text)",
          marginBottom: "28px",
        }}
      >
        ✨ Your Beauty Score
      </h2>

      <div
        style={{
          width: 200,
          height: 200,
          margin: "0 auto",
          borderRadius: "50%",
          background: `conic-gradient(var(--clr-primary) ${score}%, var(--clr-bg-3) 0)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 1s ease",
        }}
      >
        <div
          style={{
            width: 156,
            height: 156,
            background: "var(--clr-bg-2)",
            borderRadius: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--clr-border-2)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "52px",
              fontWeight: 500,
              color: "var(--clr-primary)",
              lineHeight: 1,
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--clr-text-3)",
              marginTop: "2px",
            }}
          >
            / 100
          </span>
        </div>
      </div>

      <div
        style={{
          display: "inline-flex",
          marginTop: "20px",
          padding: "6px 18px",
          border: `1px solid ${tierColor}`,
          background: `${tierColor}15`,
          color: tierColor,
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {tier}
      </div>
    </div>
  );
}

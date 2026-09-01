import React, { useEffect, useState } from "react";

const STEPS = [
  "📷 Detecting Face...",
  "🧬 Extracting Skin Region...",
  "💧 Measuring Hydration...",
  "✨ Detecting Pigmentation...",
  "🔍 Analyzing Acne & Texture...",
  "🤖 Generating BeautyDNA...",
  "💄 Preparing Recommendations...",
];

export default function ScanLoader() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current >= STEPS.length - 1) return;
    const timer = setTimeout(() => setCurrent((c) => c + 1), 650);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <div
      style={{
        background: "var(--clr-bg-2)",
        border: "1px solid var(--clr-border-2)",
        borderRadius: "4px",
        padding: "56px 44px",
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
        }}
      >
        BeautyDNA™ Engine
      </span>

      <div
        style={{
          fontSize: "72px",
          marginTop: "20px",
          marginBottom: "8px",
          animation: "suiisPulse 1.6s ease-in-out infinite",
        }}
      >
        🤖
      </div>

      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "26px",
          fontWeight: 300,
          color: "var(--clr-text)",
          marginBottom: "32px",
          minHeight: "32px",
          transition: "opacity 0.3s ease",
        }}
      >
        {STEPS[current]}
      </h2>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          height: "3px",
          background: "var(--clr-bg-3)",
          borderRadius: "2px",
          overflow: "hidden",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            width: `${((current + 1) / STEPS.length) * 100}%`,
            height: "100%",
            background:
              "linear-gradient(90deg, var(--clr-primary), var(--clr-primary-light))",
            transition: "width 0.6s ease",
          }}
        />
      </div>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          color: "var(--clr-text-muted)",
          letterSpacing: "0.08em",
        }}
      >
        Step {current + 1} of {STEPS.length}
      </p>

      {/* Step dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "6px",
          marginTop: "24px",
        }}
      >
        {STEPS.map((_, i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: i <= current ? "var(--clr-primary)" : "var(--clr-border-2)",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes suiisPulse {
          0%   { transform: scale(1);    opacity: 1;   }
          50%  { transform: scale(1.12); opacity: 0.85; }
          100% { transform: scale(1);    opacity: 1;   }
        }
      `}</style>
    </div>
  );
}

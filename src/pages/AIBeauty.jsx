import React from "react";
import { Link } from "react-router-dom";

const STEPS = [
  { icon: "📷", title: "Upload a Selfie", desc: "Take or upload a clear, well-lit photo of your face." },
  { icon: "🤖", title: "AI Analyzes Your Skin", desc: "Our model scans hydration, oiliness, acne, pigmentation & more." },
  { icon: "📋", title: "Get Your BeautyDNA Report", desc: "Receive a detailed skin score with morning & night routines." },
  { icon: "🛍️", title: "Shop Your Matches", desc: "Add AI-recommended SUIIS products straight to your bag." },
];

const FEATURES = [
  { icon: "💧", title: "Hydration Analysis", desc: "Know exactly how hydrated your skin is, down to the percentage." },
  { icon: "🔴", title: "Acne Detection", desc: "Identify blemish severity and get targeted product matches." },
  { icon: "✨", title: "Pigmentation Scan", desc: "Spot dark spots and uneven tone before they become visible." },
  { icon: "👁", title: "Dark Circle Tracking", desc: "Monitor under-eye fatigue and get brightening recommendations." },
];

export default function AIBeauty() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)" }}>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          padding: "100px 40px 80px",
          textAlign: "center",
          overflow: "hidden",
          borderBottom: "1px solid var(--clr-divider)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: "720px", margin: "0 auto" }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "var(--clr-primary)",
              display: "block",
              marginBottom: "20px",
            }}
          >
            Powered by Artificial Intelligence
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 7vw, 76px)",
              fontWeight: 300,
              lineHeight: 1.05,
              color: "var(--clr-text)",
              marginBottom: "24px",
            }}
          >
            Meet <em style={{ fontStyle: "italic", color: "var(--clr-primary)" }}>BeautyDNA™</em>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              fontWeight: 300,
              color: "var(--clr-text-3)",
              lineHeight: 1.75,
              maxWidth: "520px",
              margin: "0 auto 40px",
            }}
          >
            Upload a selfie and let our AI decode your skin — hydration, oiliness,
            acne, pigmentation, and more — then get a personalized routine built
            entirely from SUIIS Beauty products.
          </p>
          <Link
            to="/beauty-dna"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 42px",
              background: "var(--clr-primary)",
              color: "var(--clr-bg)",
              textDecoration: "none",
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--clr-primary-light)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--clr-primary)")}
          >
            ✨ Try BeautyDNA Free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "var(--clr-text-muted)",
              marginTop: "16px",
            }}
          >
            Free · Takes under 60 seconds · No account required
          </p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "90px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--clr-primary)",
                display: "block",
                marginBottom: "14px",
              }}
            >
              The Process
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(30px, 4vw, 48px)",
                fontWeight: 300,
                color: "var(--clr-text)",
              }}
            >
              How BeautyDNA Works
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1px",
              background: "var(--clr-divider)",
              border: "1px solid var(--clr-divider)",
            }}
          >
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                style={{
                  background: "var(--clr-bg-2)",
                  padding: "40px 28px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "13px",
                    color: "var(--clr-primary)",
                    marginBottom: "16px",
                    letterSpacing: "0.1em",
                  }}
                >
                  STEP {i + 1}
                </div>
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>{s.icon}</div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "18px",
                    fontWeight: 400,
                    color: "var(--clr-text)",
                    marginBottom: "10px",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "var(--clr-text-3)",
                    lineHeight: 1.7,
                    fontWeight: 300,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding: "0 40px 90px", background: "var(--clr-bg-2)", paddingTop: "90px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--clr-primary)",
                display: "block",
                marginBottom: "14px",
              }}
            >
              What We Analyze
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(30px, 4vw, 48px)",
                fontWeight: 300,
                color: "var(--clr-text)",
              }}
            >
              Deep Skin Intelligence
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
            }}
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  background: "var(--clr-bg-card)",
                  border: "1px solid var(--clr-border-2)",
                  padding: "28px 22px",
                  transition: "border-color 0.25s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--clr-border)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--clr-border-2)")}
              >
                <div style={{ fontSize: "28px", marginBottom: "14px" }}>{f.icon}</div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "17px",
                    fontWeight: 400,
                    color: "var(--clr-text)",
                    marginBottom: "8px",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "var(--clr-text-3)",
                    lineHeight: 1.7,
                    fontWeight: 300,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: "90px 40px", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 300,
            color: "var(--clr-text)",
            marginBottom: "16px",
          }}
        >
          Ready to discover your <em style={{ fontStyle: "italic", color: "var(--clr-primary)" }}>BeautyDNA</em>?
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--clr-text-3)",
            marginBottom: "32px",
          }}
        >
          It only takes a selfie and 60 seconds.
        </p>
        <Link
          to="/beauty-dna"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "16px 42px",
            background: "var(--clr-primary)",
            color: "var(--clr-bg)",
            textDecoration: "none",
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Start My Analysis →
        </Link>
      </section>
    </div>
  );
}

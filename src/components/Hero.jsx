import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const labelRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollRef = useRef(null);
  const overlayRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    // Initial states
    gsap.set([labelRef.current, titleRef.current, subRef.current, ctaRef.current, scrollRef.current, statsRef.current], {
      autoAlpha: 0,
    });
    gsap.set(overlayRef.current, { opacity: 1 });

    // Animation sequence
    tl
      .to(overlayRef.current, { opacity: 0, duration: 1.2, ease: "power2.out" })
      .to(labelRef.current, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.6")
      .fromTo(titleRef.current,
        { autoAlpha: 0, y: 60 },
        { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(subRef.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(ctaRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(statsRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(scrollRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5 },
        "-=0.2"
      );

    // Parallax on scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${scrollY * 0.35}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      style={{
        position: "relative",
        height: "100svh",
        minHeight: "600px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          inset: "-20%",
          backgroundImage: `url("https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&q=85")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: "transform",
        }}
      />

      {/* Multi-layer overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.65) 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 50%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(201,169,110,0.04) 0%, transparent 70%)",
      }} />

      {/* Initial load overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute", inset: 0,
          background: "var(--clr-bg)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Decorative corner lines */}
      <div style={{
        position: "absolute", top: 32, left: 32,
        width: 60, height: 60,
        borderTop: "1px solid rgba(201,169,110,0.3)",
        borderLeft: "1px solid rgba(201,169,110,0.3)",
      }} />
      <div style={{
        position: "absolute", top: 32, right: 32,
        width: 60, height: 60,
        borderTop: "1px solid rgba(201,169,110,0.3)",
        borderRight: "1px solid rgba(201,169,110,0.3)",
      }} />
      <div style={{
        position: "absolute", bottom: 80, left: 32,
        width: 60, height: 60,
        borderBottom: "1px solid rgba(201,169,110,0.3)",
        borderLeft: "1px solid rgba(201,169,110,0.3)",
      }} />
      <div style={{
        position: "absolute", bottom: 80, right: 32,
        width: 60, height: 60,
        borderBottom: "1px solid rgba(201,169,110,0.3)",
        borderRight: "1px solid rgba(201,169,110,0.3)",
      }} />

      {/* Vertical lines */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: "15%",
        width: "1px",
        background: "linear-gradient(to bottom, transparent, rgba(201,169,110,0.08), transparent)",
      }} />
      <div style={{
        position: "absolute", top: 0, bottom: 0, right: "15%",
        width: "1px",
        background: "linear-gradient(to bottom, transparent, rgba(201,169,110,0.08), transparent)",
      }} />

      {/* Main Content */}
      <div style={{
        position: "relative", zIndex: 2,
        textAlign: "center",
        padding: "0 24px",
        maxWidth: "900px",
        width: "100%",
      }}>
        {/* Label */}
        <div
          ref={labelRef}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px", fontWeight: 500,
            letterSpacing: "0.4em", textTransform: "uppercase",
            color: "var(--clr-primary)",
            marginBottom: "24px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "16px",
          }}
        >
          <span style={{ width: 40, height: 1, background: "var(--clr-primary)", opacity: 0.5 }} />
          Luxury Beauty Since 2020
          <span style={{ width: 40, height: 1, background: "var(--clr-primary)", opacity: 0.5 }} />
        </div>

        {/* Main Title */}
        <h1
          ref={titleRef}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(52px, 10vw, 120px)",
            fontWeight: 300,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: "var(--clr-text)",
            marginBottom: "24px",
          }}
        >
          Beauty is an
          <br />
          <em style={{
            fontStyle: "italic",
            color: "var(--clr-primary)",
            display: "inline-block",
          }}>
            Art Form
          </em>
        </h1>

        {/* Subtitle */}
        <p
          ref={subRef}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(14px, 2vw, 17px)",
            fontWeight: 300,
            color: "rgba(245,240,234,0.7)",
            maxWidth: "480px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
            letterSpacing: "0.03em",
          }}
        >
          Discover SUIIS — where luxury meets self-expression. Crafted with precision for those who demand nothing but perfection.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "16px", flexWrap: "wrap",
          }}
        >
          <Link
            to="/shop"
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "15px 40px",
              background: "var(--clr-primary)",
              color: "var(--clr-bg)",
              fontFamily: "var(--font-body)",
              fontSize: "11px", fontWeight: 500,
              letterSpacing: "0.2em", textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.35s ease",
              border: "1px solid var(--clr-primary)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--clr-primary)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "var(--clr-primary)";
              e.currentTarget.style.color = "var(--clr-bg)";
            }}
          >
            Shop Collection
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          <Link
            to="/shop?filter=bestseller"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "15px 40px",
              background: "transparent",
              color: "var(--clr-text)",
              fontFamily: "var(--font-body)",
              fontSize: "11px", fontWeight: 400,
              letterSpacing: "0.2em", textTransform: "uppercase",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.2)",
              transition: "all 0.35s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
              e.currentTarget.style.color = "var(--clr-text)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
          >
            Bestsellers
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div
        ref={statsRef}
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(16px)",
          display: "flex",
          justifyContent: "center",
          zIndex: 3,
        }}
      >
        {[
          { value: "50K+", label: "Happy Customers" },
          { value: "32", label: "Luxury Products" },
          { value: "100%", label: "Cruelty Free" },
          { value: "4.8★", label: "Average Rating" },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              padding: "20px 40px",
              textAlign: "center",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
              flex: "1 0 auto",
              maxWidth: "200px",
            }}
          >
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px", fontWeight: 500,
              color: "var(--clr-primary)",
              letterSpacing: "-0.01em",
            }}>{stat.value}</div>
            <div style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px", fontWeight: 400,
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "var(--clr-text-3)",
              marginTop: "3px",
            }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        style={{
          position: "absolute",
          bottom: "110px", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "8px",
          zIndex: 3,
          animation: "scrollBounce 2s ease-in-out infinite",
        }}
      >
        <span style={{
          fontFamily: "var(--font-body)", fontSize: "9px",
          fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
        }}>Scroll</span>
        <div style={{
          width: 1, height: 40,
          background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
          animation: "scrollLine 2s ease-in-out infinite",
        }} />
      </div>

      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
        @keyframes scrollLine {
          0% { opacity: 1; height: 40px; }
          50% { opacity: 0.4; height: 20px; }
          100% { opacity: 1; height: 40px; }
        }
      `}</style>
    </section>
  );
}
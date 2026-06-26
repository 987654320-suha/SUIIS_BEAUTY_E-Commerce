import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Loader({ onComplete }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const lineRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) setTimeout(onComplete, 500);
      }
    });

    gsap.set(containerRef.current, { autoAlpha: 1 });
    gsap.set([textRef.current, lineRef.current, logoRef.current], { autoAlpha: 0, scale: 0.9 });

    tl
      .fromTo(logoRef.current,
        { autoAlpha: 0, scale: 0.5, y: 20 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(0.8)" }
      )
      .fromTo(textRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      )
      .fromTo(lineRef.current,
        { autoAlpha: 0, scaleX: 0 },
        { autoAlpha: 1, scaleX: 1, duration: 0.8, ease: "power2.inOut", transformOrigin: "left" },
        "-=0.3"
      )
      .to(containerRef.current, {
        autoAlpha: 0,
        duration: 0.6,
        delay: 0.5,
        ease: "power2.in"
      });
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "var(--clr-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <div ref={logoRef} style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "52px",
          fontWeight: 300,
          letterSpacing: "0.18em",
          color: "var(--clr-primary)",
          textTransform: "uppercase",
        }}>
          Suiis
        </div>
        <div style={{
          fontFamily: "var(--font-body)",
          fontSize: "10px",
          fontWeight: 500,
          letterSpacing: "0.35em",
          color: "var(--clr-text-3)",
          textTransform: "uppercase",
          marginTop: "4px",
        }}>
          Beauty
        </div>
      </div>

      <div ref={textRef} style={{
        fontFamily: "var(--font-body)",
        fontSize: "11px",
        fontWeight: 400,
        letterSpacing: "0.3em",
        color: "var(--clr-text-3)",
        textTransform: "uppercase",
      }}>
        Luxury for the modern soul
      </div>

      <div
        ref={lineRef}
        style={{
          width: "120px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--clr-primary), transparent)",
        }}
      />
    </div>
  );
}
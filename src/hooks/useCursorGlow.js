import { useEffect, useRef } from "react";
import gsap from "gsap";

export const useCursorGlow = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);

  useEffect(() => {
    // Create cursor elements
    const cursor = document.createElement("div");
    const dot = document.createElement("div");
    const ring = document.createElement("div");

    cursor.className = "custom-cursor";
    dot.className = "custom-cursor-dot";
    ring.className = "custom-cursor-ring";

    document.body.appendChild(cursor);
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    cursorRef.current = cursor;
    cursorDotRef.current = dot;
    cursorRingRef.current = ring;

    // Styles
    Object.assign(cursor.style, {
      position: "fixed",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      border: "1px solid var(--clr-primary)",
      pointerEvents: "none",
      zIndex: 9999,
      transform: "translate(-50%, -50%)",
      transition: "width 0.3s, height 0.3s, border-color 0.3s",
      opacity: 0,
    });

    Object.assign(dot.style, {
      position: "fixed",
      width: "4px",
      height: "4px",
      borderRadius: "50%",
      backgroundColor: "var(--clr-primary)",
      pointerEvents: "none",
      zIndex: 10000,
      transform: "translate(-50%, -50%)",
      opacity: 0,
    });

    Object.assign(ring.style, {
      position: "fixed",
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      border: "2px solid rgba(201,169,110,0.2)",
      pointerEvents: "none",
      zIndex: 9998,
      transform: "translate(-50%, -50%)",
      opacity: 0,
      transition: "width 0.3s, height 0.3s, opacity 0.3s",
    });

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out",
      });

      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.05,
        ease: "power2.out",
      });
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      
      gsap.set(ring, { x: ringX, y: ringY });
      requestAnimationFrame(animateRing);
    };

    const onMouseEnter = () => {
      gsap.to([cursor, dot, ring], { opacity: 1, duration: 0.3 });
    };

    const onMouseLeave = () => {
      gsap.to([cursor, dot, ring], { opacity: 0, duration: 0.3 });
    };

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll("a, button, .btn, .product-card, input, select, textarea");
    
    const onElementHover = () => {
      gsap.to(cursor, { width: 60, height: 60, borderColor: "var(--clr-primary-light)", duration: 0.2 });
      gsap.to(ring, { width: 100, height: 100, opacity: 0.3, duration: 0.2 });
    };

    const onElementLeave = () => {
      gsap.to(cursor, { width: 40, height: 40, borderColor: "var(--clr-primary)", duration: 0.2 });
      gsap.to(ring, { width: 80, height: 80, opacity: 0, duration: 0.2 });
    };

    interactiveElements.forEach(el => {
      el.addEventListener("mouseenter", onElementHover);
      el.addEventListener("mouseleave", onElementLeave);
    });

    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mousemove", onMouseMove);
    
    animateRing();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      interactiveElements.forEach(el => {
        el.removeEventListener("mouseenter", onElementHover);
        el.removeEventListener("mouseleave", onElementLeave);
      });
      cursor.remove();
      dot.remove();
      ring.remove();
    };
  }, []);

  return { cursorRef, cursorDotRef, cursorRingRef };
};
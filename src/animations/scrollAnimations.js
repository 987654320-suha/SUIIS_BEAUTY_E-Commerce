import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugins(ScrollTrigger);

export const initScrollAnimations = () => {
  // Fade up animations
  gsap.utils.toArray(".fade-up").forEach((element) => {
    gsap.fromTo(element,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "bottom 60%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Fade left animations
  gsap.utils.toArray(".fade-left").forEach((element) => {
    gsap.fromTo(element,
      { opacity: 0, x: -60 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "bottom 60%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Fade right animations
  gsap.utils.toArray(".fade-right").forEach((element) => {
    gsap.fromTo(element,
      { opacity: 0, x: 60 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "bottom 60%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Scale in animations
  gsap.utils.toArray(".scale-in").forEach((element) => {
    gsap.fromTo(element,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(0.4)",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "bottom 60%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Parallax effect for sections
  gsap.utils.toArray(".parallax-bg").forEach((element) => {
    gsap.to(element, {
      y: () => -window.innerHeight * 0.2,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  // Stagger children
  gsap.utils.toArray(".stagger-children").forEach((container) => {
    const children = container.children;
    gsap.fromTo(children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          end: "bottom 60%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
};

export const initHeroAnimation = (elements) => {
  const tl = gsap.timeline();
  
  if (elements.label) {
    gsap.set(elements.label, { opacity: 0, y: 20 });
    tl.to(elements.label, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
  }
  
  if (elements.title) {
    gsap.set(elements.title, { opacity: 0, y: 40 });
    tl.to(elements.title, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3");
  }
  
  if (elements.subtitle) {
    gsap.set(elements.subtitle, { opacity: 0, y: 30 });
    tl.to(elements.subtitle, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.4");
  }
  
  if (elements.cta) {
    gsap.set(elements.cta, { opacity: 0, y: 20 });
    tl.to(elements.cta, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(0.5)" }, "-=0.3");
  }
  
  return tl;
};
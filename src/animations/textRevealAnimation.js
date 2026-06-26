import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export const createTextReveal = (element, options = {}) => {
  const split = new SplitText(element, {
    type: "lines,words,chars",
    linesClass: "reveal-line",
    charsClass: "reveal-char",
  });

  const defaults = {
    duration: 1.2,
    stagger: 0.03,
    ease: "power3.inOut",
    y: 0,
    opacity: 0,
    transformOrigin: "0% 50%",
    rotateY: 90,
    ...options
  };

  gsap.fromTo(split.chars,
    { 
      opacity: 0, 
      y: defaults.y,
      rotateY: defaults.rotateY,
      transformOrigin: defaults.transformOrigin
    },
    {
      opacity: 1,
      y: 0,
      rotateY: 0,
      duration: defaults.duration,
      stagger: defaults.stagger,
      ease: defaults.ease,
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        end: "bottom 60%",
        toggleActions: "play none none reverse",
      },
    }
  );

  return split;
};

export const createSlideReveal = (element, direction = "left") => {
  const directionMap = {
    left: { x: -100 },
    right: { x: 100 },
    up: { y: -100 },
    down: { y: 100 }
  };

  const fromProps = directionMap[direction] || directionMap.left;
  
  gsap.fromTo(element,
    { opacity: 0, ...fromProps },
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        end: "bottom 60%",
        toggleActions: "play none none reverse",
      },
    }
  );
};

export const createClipReveal = (element) => {
  gsap.set(element, { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" });
  
  gsap.to(element, {
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    duration: 1.2,
    ease: "power3.inOut",
    scrollTrigger: {
      trigger: element,
      start: "top 85%",
      end: "bottom 60%",
      toggleActions: "play none none reverse",
    },
  });
};
import gsap from "gsap";

export const setupProductCardHover = (cardElement) => {
  if (!cardElement) return;
  
  const image = cardElement.querySelector(".product-image");
  const overlay = cardElement.querySelector(".product-overlay");
  const quickAdd = cardElement.querySelector(".quick-add-btn");
  const wishlistBtn = cardElement.querySelector(".wishlist-btn");
  
  const tl = gsap.timeline({ paused: true });
  
  tl.to(image, { 
    scale: 1.08, 
    duration: 0.6, 
    ease: "power2.out" 
  })
  .to(overlay, { 
    opacity: 1, 
    duration: 0.4, 
    ease: "power2.out" 
  }, 0)
  .to(quickAdd, { 
    y: 0, 
    opacity: 1, 
    duration: 0.4, 
    ease: "back.out(0.7)" 
  }, 0.1)
  .to(wishlistBtn, { 
    scale: 1, 
    opacity: 1, 
    duration: 0.3, 
    ease: "back.out(0.7)" 
  }, 0.15);
  
  cardElement.addEventListener("mouseenter", () => tl.play());
  cardElement.addEventListener("mouseleave", () => tl.reverse());
};

export const animateProductLoad = (productsContainer) => {
  const cards = productsContainer.querySelectorAll(".product-card");
  
  gsap.fromTo(cards,
    { opacity: 0, y: 50 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      stagger: 0.08, 
      ease: "power2.out",
      clearProps: "all"
    }
  );
};
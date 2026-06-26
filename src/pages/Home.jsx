import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { FEATURED_PRODUCTS, BESTSELLER_PRODUCTS, NEW_PRODUCTS, CATEGORIES } from "../data/products";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

// Intersection Observer reveal hook
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("revealed"); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// Marquee announcement texts
const MARQUEE_ITEMS = [
  "Free Shipping Above ₹1499",
  "New Collection Launched",
  "Cruelty Free & Vegan",
  "Use Code SUIIS20 for 20% Off",
  "Clean Beauty Always",
  "Luxury Formulas",
  "Made with Love",
  "50,000+ Happy Customers",
  "Free Shipping Above ₹1499",
  "New Collection Launched",
  "Cruelty Free & Vegan",
  "Use Code SUIIS20 for 20% Off",
  "Clean Beauty Always",
  "Luxury Formulas",
  "Made with Love",
  "50,000+ Happy Customers",
];

function Marquee() {
  return (
    <div style={{
      overflow: "hidden",
      borderTop: "1px solid var(--clr-divider)",
      borderBottom: "1px solid var(--clr-divider)",
      padding: "13px 0",
      background: "var(--clr-bg-2)",
    }}>
      <div style={{
        display: "flex",
        gap: "48px",
        whiteSpace: "nowrap",
        animation: "marquee 35s linear infinite",
        willChange: "transform",
      }}>
        {MARQUEE_ITEMS.map((item, i) => (
          <span key={i} style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px", fontWeight: 500,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "var(--clr-text-3)",
            flexShrink: 0,
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <span style={{
              width: 3, height: 3, borderRadius: "50%",
              background: "var(--clr-primary)", display: "inline-block", flexShrink: 0,
            }} />
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function SectionHeader({ label, title, subtitle, centered = true }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{
      textAlign: centered ? "center" : "left",
      marginBottom: "56px",
    }}>
      {label && (
        <span style={{
          fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500,
          letterSpacing: "0.3em", textTransform: "uppercase",
          color: "var(--clr-primary)", display: "block", marginBottom: "16px",
        }}>{label}</span>
      )}
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(32px, 5vw, 60px)",
        fontWeight: 300, lineHeight: 1.05,
        color: "var(--clr-text)", marginBottom: "16px",
      }}>{title}</h2>
      {subtitle && (
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "14px",
          fontWeight: 300, color: "var(--clr-text-3)",
          maxWidth: centered ? "460px" : "none",
          margin: centered ? "0 auto" : "0",
          lineHeight: 1.75,
        }}>{subtitle}</p>
      )}
    </div>
  );
}

// Category Cards section
function CategoryGrid() {
  const navigate = useNavigate();
  const categories = [
    {
      name: "Lips",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80",
      count: "4 Products",
    },
    {
      name: "Eyes",
      image: "https://images.unsplash.com/photo-1583241800862-0820b6c0c2b3?w=600&q=80",
      count: "4 Products",
    },
    {
      name: "Face",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
      count: "8 Products",
    },
    {
      name: "Skincare",
      image: "https://images.unsplash.com/photo-1564164841584-391b5c7b590c?w=600&q=80",
      count: "4 Products",
    },
    {
      name: "Fragrance",
      image: "https://images.unsplash.com/photo-1564294930745-c3fd9fc00d74?w=600&q=80",
      count: "2 Products",
    },
    {
      name: "Gift Sets",
      image: "https://images.unsplash.com/photo-1607346705624-8a9c9d2b7f6e?w=600&q=80",
      count: "3 Products",
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: "2px",
    }}>
      {categories.map((cat, i) => {
        const ref = useRef(null);
        return (
          <button
            key={cat.name}
            ref={ref}
            onClick={() => navigate(`/shop/${cat.name}`)}
            style={{
              position: "relative",
              aspectRatio: i === 0 || i === 2 ? "2/3" : "2/3",
              overflow: "hidden",
              border: "none",
              cursor: "pointer",
              background: "var(--clr-bg-3)",
              gridColumn: i === 0 ? "span 2" : "span 1",
            }}
            className="reveal"
            onMouseEnter={e => {
              e.currentTarget.querySelector("img").style.transform = "scale(1.08)";
              e.currentTarget.querySelector(".cat-overlay").style.opacity = "0.6";
            }}
            onMouseLeave={e => {
              e.currentTarget.querySelector("img").style.transform = "scale(1)";
              e.currentTarget.querySelector(".cat-overlay").style.opacity = "0.35";
            }}
          >
            <img
              src={cat.image}
              alt={cat.name}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                transition: "transform 0.6s var(--ease-smooth)",
              }}
            />
            <div
              className="cat-overlay"
              style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                opacity: 0.35,
                transition: "opacity 0.4s ease",
              }}
            />
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "20px 16px",
              textAlign: "left",
            }}>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: "20px",
                fontWeight: 400, color: "var(--clr-text)",
                marginBottom: "2px",
              }}>{cat.name}</div>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: "10px",
                letterSpacing: "0.15em", textTransform: "uppercase",
                color: "var(--clr-primary)",
              }}>{cat.count}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Brand values section
function BrandValues() {
  const values = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="1.2" strokeLinecap="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Clean Formulas",
      desc: "No parabens, no sulfates, no harmful chemicals. Every product is clean beauty certified.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="1.2" strokeLinecap="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      title: "Cruelty Free",
      desc: "PETA certified. We never test on animals and never will. Beauty without compromise.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="1.2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
        </svg>
      ),
      title: "Long-Lasting",
      desc: "Formulated for 12–16 hour wear. From morning rituals to midnight moments.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="1.2" strokeLinecap="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
      ),
      title: "Made in India",
      desc: "Proudly crafted in our state-of-the-art facility. Supporting local artisans and innovation.",
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "1px",
      background: "var(--clr-divider)",
      border: "1px solid var(--clr-divider)",
    }}>
      {values.map((v, i) => (
        <div
          key={i}
          className="reveal"
          style={{
            padding: "48px 32px",
            background: "var(--clr-bg-2)",
            textAlign: "center",
            transition: "background 0.3s ease",
            animationDelay: `${i * 0.1}s`,
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--clr-bg-3)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--clr-bg-2)"}
        >
          <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>
            {v.icon}
          </div>
          <h4 style={{
            fontFamily: "var(--font-display)", fontSize: "20px",
            fontWeight: 400, color: "var(--clr-text)",
            marginBottom: "12px",
          }}>{v.title}</h4>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "13px",
            fontWeight: 300, color: "var(--clr-text-3)",
            lineHeight: 1.75,
          }}>{v.desc}</p>
        </div>
      ))}
    </div>
  );
}

// Testimonials section
function Testimonials() {
  const reviews = [
    {
      name: "Priya Sharma",
      city: "Mumbai",
      rating: 5,
      text: "SUIIS lipstick is absolutely stunning. The color payoff is insane and it lasts all day. I've never felt so confident. This is my forever brand.",
      product: "Velvet Noir Matte Lipstick",
      avatar: "PS",
    },
    {
      name: "Aarohi Patel",
      city: "Ahmedabad",
      rating: 5,
      text: "The Noir Dramatique palette is worth every rupee. Buttery smooth, highly pigmented, and the packaging is absolutely gorgeous. 10/10.",
      product: "Noir Dramatique Eye Palette",
      avatar: "AP",
    },
    {
      name: "Sneha Menon",
      city: "Bangalore",
      rating: 5,
      text: "I ordered the bridal collection for my wedding and I could not be happier. My makeup looked flawless for 14 hours straight. Thank you SUIIS!",
      product: "Bridal Beauty Collection",
      avatar: "SM",
    },
    {
      name: "Ritu Khanna",
      city: "Delhi",
      rating: 5,
      text: "The Radiance Revival Serum completely transformed my skin in just 3 weeks. Dark spots faded visibly. This is genuinely luxurious skincare.",
      product: "Radiance Revival Serum",
      avatar: "RK",
    },
  ];

  const renderStars = (n) =>
    Array.from({ length: 5 }, (_, i) => (
      <svg key={i} width="12" height="12" viewBox="0 0 24 24"
        fill={i < n ? "var(--clr-primary)" : "none"}
        stroke="var(--clr-primary)" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ));

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "16px",
    }}>
      {reviews.map((r, i) => (
        <div
          key={i}
          className="reveal"
          style={{
            padding: "32px",
            background: "var(--clr-bg-card)",
            border: "1px solid var(--clr-border-2)",
            display: "flex", flexDirection: "column",
            gap: "16px",
            transition: "border-color 0.3s, transform 0.3s",
            animationDelay: `${i * 0.08}s`,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "var(--clr-border)";
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "var(--clr-border-2)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {/* Stars */}
          <div style={{ display: "flex", gap: "3px" }}>{renderStars(r.rating)}</div>

          {/* Quote mark */}
          <div style={{
            fontFamily: "var(--font-display)", fontSize: "48px",
            color: "var(--clr-primary)", opacity: 0.3, lineHeight: 0.7, marginBottom: "-8px",
          }}>"</div>

          {/* Text */}
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "13px",
            fontWeight: 300, color: "var(--clr-text-2)",
            lineHeight: 1.75, flex: 1,
          }}>{r.text}</p>

          {/* Product */}
          <div style={{
            fontFamily: "var(--font-body)", fontSize: "10px",
            letterSpacing: "0.1em", color: "var(--clr-primary)",
            textTransform: "uppercase",
          }}>
            {r.product}
          </div>

          {/* Reviewer */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            paddingTop: "16px",
            borderTop: "1px solid var(--clr-divider)",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(201,169,110,0.15)",
              border: "1px solid var(--clr-primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-body)", fontSize: "11px",
              fontWeight: 600, color: "var(--clr-primary)",
              letterSpacing: "0.05em", flexShrink: 0,
            }}>{r.avatar}</div>
            <div>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: "13px",
                fontWeight: 500, color: "var(--clr-text)",
              }}>{r.name}</div>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: "11px",
                color: "var(--clr-text-3)",
              }}>{r.city}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Big editorial feature block
function EditorialFeature() {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      minHeight: "560px",
      border: "1px solid var(--clr-border-2)",
      overflow: "hidden",
    }}>
      <div style={{
        position: "relative",
        overflow: "hidden",
      }}>
        <img
          src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=900&q=85"
          alt="Editorial"
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            transition: "transform 0.8s var(--ease-smooth)",
          }}
          onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(201,169,110,0.15) 0%, transparent 50%)",
        }} />
      </div>
      <div style={{
        padding: "64px 56px",
        background: "var(--clr-bg-2)",
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <span style={{
          fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500,
          letterSpacing: "0.3em", textTransform: "uppercase",
          color: "var(--clr-primary)", display: "block", marginBottom: "20px",
        }}>Our Philosophy</span>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 4vw, 52px)",
          fontWeight: 300, lineHeight: 1.1,
          color: "var(--clr-text)", marginBottom: "24px",
        }}>
          Beauty That Tells
          <br />
          <em style={{ fontStyle: "italic", color: "var(--clr-primary)" }}>Your Story</em>
        </h2>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "14px",
          fontWeight: 300, color: "var(--clr-text-3)",
          lineHeight: 1.8, marginBottom: "16px",
        }}>
          At SUIIS, we believe beauty is deeply personal. Every formula is developed with dermatologists and artisan perfumers to deliver an experience that transcends the ordinary.
        </p>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "14px",
          fontWeight: 300, color: "var(--clr-text-3)",
          lineHeight: 1.8, marginBottom: "40px",
        }}>
          Our ingredients are ethically sourced from across the globe — Bulgarian rose, Moroccan argan, Japanese sake extract — all meeting our uncompromising standards.
        </p>
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px" }}>
          {[["2020", "Founded"], ["32+", "Products"], ["50K", "Customers"]].map(([n, l]) => (
            <div key={l}>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: "28px",
                fontWeight: 500, color: "var(--clr-primary)",
              }}>{n}</div>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: "10px",
                letterSpacing: "0.15em", textTransform: "uppercase",
                color: "var(--clr-text-3)", marginTop: "2px",
              }}>{l}</div>
            </div>
          ))}
        </div>
        <Link
          to="/shop"
          style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            padding: "14px 32px",
            border: "1px solid var(--clr-primary)",
            color: "var(--clr-primary)",
            fontFamily: "var(--font-body)", fontSize: "11px",
            fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase",
            textDecoration: "none", alignSelf: "flex-start",
            transition: "all 0.35s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "var(--clr-primary)";
            e.currentTarget.style.color = "var(--clr-bg)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--clr-primary)";
          }}
        >
          Explore Collection
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

// Instagram-style grid
function InstagramSection() {
  const images = [
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
    "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
    "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&q=80",
    "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80",
    "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&q=80",
  ];

  return (
    <div>
      <div style={{
        textAlign: "center", marginBottom: "40px",
      }}>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-body)", fontSize: "12px",
            fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "var(--clr-primary)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: "8px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          @suiisbeauty on Instagram
        </a>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: "3px",
      }}>
        {images.map((img, i) => (
          <a
            key={i}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              aspectRatio: "1/1",
              overflow: "hidden",
              position: "relative",
            }}
            onMouseEnter={e => {
              e.currentTarget.querySelector("img").style.transform = "scale(1.08)";
              e.currentTarget.querySelector(".ig-overlay").style.opacity = "1";
            }}
            onMouseLeave={e => {
              e.currentTarget.querySelector("img").style.transform = "scale(1)";
              e.currentTarget.querySelector(".ig-overlay").style.opacity = "0";
            }}
          >
            <img
              src={img}
              alt={`SUIIS Instagram ${i + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
            />
            <div
              className="ig-overlay"
              style={{
                position: "absolute", inset: 0,
                background: "rgba(201,169,110,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: 0, transition: "opacity 0.3s ease",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    // IntersectionObserver for reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Marquee */}
      <Marquee />

      {/* 3. Category Grid */}
      <section style={{ padding: "96px 0 0" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px", marginBottom: "32px" }}>
          <SectionHeader
            label="Explore"
            title="Shop by Category"
            subtitle="From bold lip statements to ethereal glows — find exactly what your beauty ritual needs."
          />
        </div>
        <CategoryGrid />
      </section>

      {/* 4. Featured Products */}
      <section style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px" }}>
          <SectionHeader
            label="Curated For You"
            title="Featured Products"
            subtitle="Our most-loved formulas, handpicked by our beauty editors."
          />
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}>
            {FEATURED_PRODUCTS.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link
              to="/shop"
              style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                padding: "15px 48px",
                border: "1px solid var(--clr-border)",
                color: "var(--clr-text-2)",
                fontFamily: "var(--font-body)", fontSize: "11px",
                fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase",
                textDecoration: "none", transition: "all 0.35s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--clr-primary)";
                e.currentTarget.style.color = "var(--clr-primary)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--clr-border)";
                e.currentTarget.style.color = "var(--clr-text-2)";
              }}
            >
              View All Products
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Brand Values */}
      <section style={{ padding: "0 0 96px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px" }}>
          <BrandValues />
        </div>
      </section>

      {/* 6. Editorial Feature */}
      <section style={{ padding: "0 0 96px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px" }}>
          <EditorialFeature />
        </div>
      </section>

      {/* 7. Bestsellers */}
      <section style={{ padding: "0 0 96px", background: "var(--clr-bg-2)", paddingTop: "96px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px" }}>
          <SectionHeader
            label="Most Loved"
            title="Our Bestsellers"
            subtitle="Products our community can't stop talking about."
          />
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}>
            {BESTSELLER_PRODUCTS.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. New Arrivals */}
      <section style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px" }}>
          <SectionHeader
            label="Just Arrived"
            title="New In"
            subtitle="Fresh from the lab — our latest innovations."
          />
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}>
            {NEW_PRODUCTS.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section style={{ padding: "0 0 96px", background: "var(--clr-bg-2)", paddingTop: "96px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px" }}>
          <SectionHeader
            label="Real Reviews"
            title="What Our Community Says"
            subtitle="Over 50,000 happy customers and counting."
          />
          <Testimonials />
        </div>
      </section>

      {/* 10. Instagram */}
      <section style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px", marginBottom: "0" }}>
          <SectionHeader
            label="Community"
            title="#SuiisBeauty"
            subtitle="Tag us on Instagram for a chance to be featured."
          />
        </div>
        <InstagramSection />
      </section>

      <style>{`
        @media (max-width: 1024px) {
          section > div > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          section > div > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          section > div > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: 1fr 1fr !important;
          }
          section > div > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr 1fr !important;
          }
          section { padding-left: 0 !important; padding-right: 0 !important; }
          section > div { padding: 0 16px !important; }
        }
      `}</style>
    </div>
  );
}
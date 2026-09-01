import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart, useWishlist } from "../context/CartContext";
import { ALL_PRODUCTS } from "../data/products";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  {
    label: "Shop",
    path: "/shop",
    mega: [
      { label: "Lips", path: "/shop/Lips", desc: "Lipstick, gloss & liners" },
      { label: "Eyes", path: "/shop/Eyes", desc: "Palettes, mascara & liner" },
      { label: "Face", path: "/shop/Face", desc: "Foundation, blush & more" },
      { label: "Skincare", path: "/shop/Skincare", desc: "Serums & moisturizers" },
      { label: "Fragrance", path: "/shop/Fragrance", desc: "EDP & parfum" },
      { label: "Accessories", path: "/shop/Accessories", desc: "Brushes & tools" },
      { label: "Gift Sets", path: "/shop/Gift Sets", desc: "Curated collections" },
    ],
  },
  { label: "Bestsellers", path: "/shop?filter=bestseller" },
  { label: "New In", path: "/shop?filter=new" },
  { label: "BeautyDNA", path: "/ai-beauty" },
  { label: "🎙️ Voice Expert", path: "/ai-beauty", isNew: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Import user from AuthContext
  const { user } = useAuth();
  
  const { cart, cartCount, cartTotal, removeFromCart, updateQty } = useCart();
  const { wishlist } = useWishlist();
  const searchRef = useRef(null);
  const megaRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setMenuOpen(false);
    setMegaOpen(false);
    setSearchOpen(false);
    setCartDrawerOpen(false);
  }, [location]);

  // Search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    setSearchResults(
      ALL_PRODUCTS.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags || []).some(t => t.includes(q))
      ).slice(0, 6)
    );
  }, [searchQuery]);

  // Focus search input
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      {/* Announcement Bar */}
      <div style={{
        background: "var(--clr-primary)",
        color: "var(--clr-bg)",
        textAlign: "center",
        padding: "8px 16px",
        fontSize: "11px",
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
      }}>
        Free Shipping on Orders Above ₹1499 · Use Code{" "}
        <strong>SUIIS20</strong> for 20% Off
      </div>

      {/* Main Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          background: scrolled
            ? "rgba(10,10,10,0.96)"
            : "rgba(10,10,10,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid var(--clr-border)"
            : "1px solid transparent",
          transition: "all 0.4s var(--ease-smooth)",
        }}
      >
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 300,
                letterSpacing: "0.18em",
                color: "var(--clr-text)",
                textTransform: "uppercase",
              }}>
                Suiis
              </span>
              <span style={{
                fontFamily: "var(--font-body)",
                fontSize: "8px",
                fontWeight: 500,
                letterSpacing: "0.35em",
                color: "var(--clr-primary)",
                textTransform: "uppercase",
                marginTop: "1px",
              }}>
                Beauty
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }} className="hide-mobile">
            {NAV_LINKS.map(link => (
              <div
                key={link.label}
                style={{ position: "relative" }}
                onMouseEnter={() => link.mega && setMegaOpen(true)}
                onMouseLeave={() => link.mega && setMegaOpen(false)}
                ref={link.mega ? megaRef : null}
              >
                <Link
                  to={link.path}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    fontWeight: 400,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: isActive(link.path) ? "var(--clr-primary)" : "var(--clr-text-2)",
                    textDecoration: "none",
                    padding: "8px 14px",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={e => { if (!isActive(link.path)) e.currentTarget.style.color = "var(--clr-text)"; }}
                  onMouseLeave={e => { if (!isActive(link.path)) e.currentTarget.style.color = "var(--clr-text-2)"; }}
                >
                  {link.label}
                  {link.isNew && (
                    <span style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "8px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: "var(--clr-bg)",
                      background: "var(--clr-accent)",
                      padding: "2px 5px",
                      borderRadius: "2px",
                      lineHeight: 1,
                    }}>NEW</span>
                  )}
                  {link.mega && (
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.5 }}>
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </Link>

                {/* Mega Menu */}
                {link.mega && megaOpen && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginTop: "8px",
                    background: "var(--clr-bg-2)",
                    border: "1px solid var(--clr-border)",
                    minWidth: "560px",
                    padding: "24px",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                    boxShadow: "var(--shadow-lg)",
                    animation: "fadeSlideDown 0.25s var(--ease-out-expo)",
                  }}>
                    {link.mega.map(item => (
                      <Link
                        key={item.label}
                        to={item.path}
                        style={{
                          padding: "14px",
                          background: "var(--clr-bg-3)",
                          border: "1px solid var(--clr-border-2)",
                          textDecoration: "none",
                          transition: "all 0.25s ease",
                          display: "block",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = "var(--clr-primary)";
                          e.currentTarget.style.background = "var(--clr-surface)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = "var(--clr-border-2)";
                          e.currentTarget.style.background = "var(--clr-bg-3)";
                        }}
                      >
                        <div style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "11px",
                          fontWeight: 500,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--clr-text)",
                          marginBottom: "4px",
                        }}>{item.label}</div>
                        <div style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "11px",
                          color: "var(--clr-text-3)",
                          fontWeight: 300,
                        }}>{item.desc}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              style={{
                width: 40, height: 40, display: "flex", alignItems: "center",
                justifyContent: "center", color: "var(--clr-text-2)",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--clr-text)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--clr-text-2)"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              style={{
                width: 40, height: 40, display: "flex", alignItems: "center",
                justifyContent: "center", color: "var(--clr-text-2)",
                textDecoration: "none", position: "relative",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--clr-accent)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--clr-text-2)"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlist.length > 0 && (
                <span style={{
                  position: "absolute", top: 6, right: 6,
                  width: 14, height: 14, borderRadius: "50%",
                  background: "var(--clr-accent)", color: "var(--clr-bg)",
                  fontSize: "9px", fontWeight: 700, display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>{wishlist.length}</span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              aria-label="Cart"
              style={{
                width: 40, height: 40, display: "flex", alignItems: "center",
                justifyContent: "center", color: "var(--clr-text-2)",
                position: "relative", transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--clr-primary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--clr-text-2)"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: 6, right: 6,
                  width: 16, height: 16, borderRadius: "50%",
                  background: "var(--clr-primary)", color: "var(--clr-bg)",
                  fontSize: "9px", fontWeight: 700, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  animation: "popIn 0.3s var(--ease-bounce)",
                }}>{cartCount}</span>
              )}
            </button>

            {/* Account */}
            <Link
              to={user ? "/profile" : "/auth"}
              aria-label="Account"
              className="hide-mobile"
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--clr-text-2)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--clr-text)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--clr-text-2)"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="show-mobile-only"
              aria-label="Menu"
              style={{
                width: 40, height: 40, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "5px",
                color: "var(--clr-text)",
              }}
            >
              <span style={{
                display: "block", width: 22, height: 1.5,
                background: "currentColor",
                transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
                transition: "all 0.3s ease",
              }} />
              <span style={{
                display: "block", width: 22, height: 1.5,
                background: "currentColor",
                opacity: menuOpen ? 0 : 1,
                transition: "all 0.3s ease",
              }} />
              <span style={{
                display: "block", width: 22, height: 1.5,
                background: "currentColor",
                transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
                transition: "all 0.3s ease",
              }} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            background: "var(--clr-bg-2)",
            borderTop: "1px solid var(--clr-divider)",
            padding: "24px 24px 32px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            animation: "fadeSlideDown 0.3s ease",
          }}>
            {NAV_LINKS.map(link => (
              <div key={link.label}>
                <Link
                  to={link.path}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px", padding: "14px 0",
                    fontFamily: "var(--font-body)", fontSize: "13px",
                    fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase",
                    color: isActive(link.path) ? "var(--clr-primary)" : "var(--clr-text-2)",
                    textDecoration: "none",
                    borderBottom: "1px solid var(--clr-divider)",
                  }}
                >
                  {link.label}
                  {link.isNew && (
                    <span style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "8px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: "var(--clr-bg)",
                      background: "var(--clr-accent)",
                      padding: "2px 5px",
                      borderRadius: "2px",
                      lineHeight: 1,
                    }}>NEW</span>
                  )}
                </Link>
                {link.mega && (
                  <div style={{ paddingLeft: "16px", paddingTop: "8px", paddingBottom: "8px" }}>
                    {link.mega.map(sub => (
                      <Link
                        key={sub.label}
                        to={sub.path}
                        style={{
                          display: "block", padding: "8px 0",
                          fontFamily: "var(--font-body)", fontSize: "12px",
                          color: "var(--clr-text-3)", textDecoration: "none",
                          letterSpacing: "0.08em",
                        }}
                      >{sub.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              to="/wishlist"
              style={{
                display: "block", padding: "14px 0",
                fontFamily: "var(--font-body)", fontSize: "13px",
                fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--clr-text-2)", textDecoration: "none",
              }}
            >Wishlist ({wishlist.length})</Link>
            <Link
              to={user ? "/profile" : "/auth"}
              style={{
                display: "block", padding: "14px 0",
                fontFamily: "var(--font-body)", fontSize: "13px",
                fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--clr-text-2)", textDecoration: "none",
              }}
            >{user ? "Profile" : "Account"}</Link>
          </div>
        )}
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          onClick={() => setSearchOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9000,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            paddingTop: "120px",
            animation: "fadeIn 0.2s ease",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: "640px", margin: "0 16px",
              animation: "fadeSlideDown 0.3s var(--ease-out-expo)",
            }}
          >
            {/* Search Input */}
            <div style={{
              display: "flex", alignItems: "center",
              background: "var(--clr-bg-2)",
              border: "1px solid var(--clr-primary)",
              padding: "0 20px",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, categories..."
                style={{
                  flex: 1, padding: "18px 16px",
                  background: "transparent", border: "none", outline: "none",
                  fontFamily: "var(--font-body)", fontSize: "16px",
                  color: "var(--clr-text)", fontWeight: 300,
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{ color: "var(--clr-text-3)", fontSize: "20px", lineHeight: 1 }}
                >×</button>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div style={{
                background: "var(--clr-bg-2)",
                border: "1px solid var(--clr-border)",
                borderTop: "none",
                maxHeight: "400px",
                overflowY: "auto",
              }}>
                {searchResults.map(product => (
                  <button
                    key={product._id}
                    onClick={() => {
                      navigate(`/product/${product._id}`);
                      setSearchOpen(false);
                    }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "16px",
                      padding: "14px 20px", background: "none", border: "none",
                      borderBottom: "1px solid var(--clr-divider)", cursor: "pointer",
                      textAlign: "left", transition: "background 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--clr-bg-3)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: 48, height: 48, objectFit: "cover", flexShrink: 0 }}
                    />
                    <div>
                      <div style={{
                        fontFamily: "var(--font-display)", fontSize: "15px",
                        color: "var(--clr-text)", marginBottom: "2px",
                      }}>{product.name}</div>
                      <div style={{
                        fontFamily: "var(--font-body)", fontSize: "12px",
                        color: "var(--clr-text-3)", letterSpacing: "0.08em",
                      }}>{product.category} · ₹{product.price.toLocaleString("en-IN")}</div>
                    </div>
                  </button>
                ))}
                <div style={{ padding: "12px 20px" }}>
                  <button
                    onClick={() => {
                      navigate(`/shop?q=${searchQuery}`);
                      setSearchOpen(false);
                    }}
                    style={{
                      fontFamily: "var(--font-body)", fontSize: "11px",
                      color: "var(--clr-primary)", letterSpacing: "0.15em",
                      textTransform: "uppercase", background: "none", border: "none",
                      cursor: "pointer",
                    }}
                  >View all results →</button>
                </div>
              </div>
            )}
            {searchQuery && searchResults.length === 0 && (
              <div style={{
                background: "var(--clr-bg-2)", border: "1px solid var(--clr-border)",
                borderTop: "none", padding: "20px",
                fontFamily: "var(--font-body)", fontSize: "13px",
                color: "var(--clr-text-3)", textAlign: "center",
              }}>
                No products found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartDrawerOpen && (
        <>
          <div
            onClick={() => setCartDrawerOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 8000,
              background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
              animation: "fadeIn 0.2s ease",
            }}
          />
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 8001,
            width: "min(420px, 100vw)",
            background: "var(--clr-bg-2)",
            borderLeft: "1px solid var(--clr-border)",
            display: "flex", flexDirection: "column",
            animation: "slideInRight 0.4s var(--ease-out-expo)",
          }}>
            {/* Drawer Header */}
            <div style={{
              padding: "24px",
              borderBottom: "1px solid var(--clr-divider)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400 }}>
                  Your Bag
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", letterSpacing: "0.1em", marginTop: "2px" }}>
                  {cartCount} {cartCount === 1 ? "item" : "items"}
                </div>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                style={{
                  width: 36, height: 36, display: "flex", alignItems: "center",
                  justifyContent: "center", border: "1px solid var(--clr-border-2)",
                  color: "var(--clr-text-2)", fontSize: "18px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-primary)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.color = "var(--clr-text-2)"; }}
              >×</button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}>🛍️</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--clr-text-2)" }}>
                    Your bag is empty
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", marginTop: "8px" }}>
                    Discover our luxury collection
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {cart.map(item => (
                    <div key={item._id} style={{
                      display: "flex", gap: "14px",
                      padding: "16px", background: "var(--clr-bg-3)",
                      border: "1px solid var(--clr-border-2)",
                    }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 72, height: 72, objectFit: "cover", flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: "var(--font-display)", fontSize: "15px",
                          color: "var(--clr-text)", marginBottom: "2px",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>{item.name}</div>
                        <div style={{
                          fontFamily: "var(--font-body)", fontSize: "11px",
                          color: "var(--clr-text-3)", letterSpacing: "0.08em", marginBottom: "10px",
                        }}>{item.category}</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          {/* Qty */}
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--clr-border-2)" }}>
                            <button
                              onClick={() => updateQty(item._id, item.qty - 1)}
                              style={{
                                width: 28, height: 28, display: "flex", alignItems: "center",
                                justifyContent: "center", fontSize: "14px", color: "var(--clr-text-2)",
                              }}
                            >−</button>
                            <span style={{
                              width: 28, textAlign: "center", fontSize: "12px",
                              borderLeft: "1px solid var(--clr-border-2)",
                              borderRight: "1px solid var(--clr-border-2)",
                              height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                            }}>{item.qty}</span>
                            <button
                              onClick={() => updateQty(item._id, item.qty + 1)}
                              style={{
                                width: 28, height: 28, display: "flex", alignItems: "center",
                                justifyContent: "center", fontSize: "14px", color: "var(--clr-text-2)",
                              }}
                            >+</button>
                          </div>
                          {/* Price */}
                          <span style={{
                            fontFamily: "var(--font-display)", fontSize: "16px",
                            color: "var(--clr-primary)",
                          }}>
                            ₹{(item.price * item.qty).toLocaleString("en-IN")}
                          </span>
                          {/* Remove */}
                          <button
                            onClick={() => removeFromCart(item._id)}
                            style={{
                              fontSize: "16px", color: "var(--clr-text-muted)",
                              transition: "color 0.2s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = "#e87070"}
                            onMouseLeave={e => e.currentTarget.style.color = "var(--clr-text-muted)"}
                          >×</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div style={{ padding: "24px", borderTop: "1px solid var(--clr-divider)" }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  marginBottom: "20px",
                }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--clr-text-3)" }}>
                    Subtotal
                  </span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--clr-primary)" }}>
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <Link
                  to="/cart"
                  onClick={() => setCartDrawerOpen(false)}
                  style={{
                    display: "block", width: "100%", padding: "15px",
                    background: "var(--clr-primary)", color: "var(--clr-bg)",
                    textAlign: "center", textDecoration: "none",
                    fontFamily: "var(--font-body)", fontSize: "11px",
                    fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase",
                    transition: "background 0.3s ease",
                    marginBottom: "10px",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--clr-primary-light)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--clr-primary)"}
                >
                  View Full Cart
                </Link>
                <div style={{
                  fontFamily: "var(--font-body)", fontSize: "11px",
                  color: "var(--clr-text-3)", textAlign: "center", letterSpacing: "0.06em",
                }}>
                  Free shipping on orders above ₹1,499
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity:0; transform: translateY(-10px); }
          to { opacity:1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; }
          to { opacity:1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes popIn {
          0% { transform: scale(0); }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}
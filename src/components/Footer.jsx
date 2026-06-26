import React, { useState } from "react";
import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  Shop: [
    { label: "All Products", path: "/shop" },
    { label: "Lips", path: "/shop/Lips" },
    { label: "Eyes", path: "/shop/Eyes" },
    { label: "Face", path: "/shop/Face" },
    { label: "Skincare", path: "/shop/Skincare" },
    { label: "Fragrance", path: "/shop/Fragrance" },
    { label: "Accessories", path: "/shop/Accessories" },
    { label: "Gift Sets", path: "/shop/Gift Sets" },
  ],
  Discover: [
    { label: "Our Story", path: "/" },
    { label: "Bestsellers", path: "/shop?filter=bestseller" },
    { label: "New In", path: "/shop?filter=new" },
    { label: "Sustainability", path: "/" },
    { label: "Ingredients", path: "/" },
    { label: "Beauty Tips", path: "/" },
  ],
  Support: [
    { label: "My Account", path: "/login" },
    { label: "Track Order", path: "/" },
    { label: "Returns & Exchanges", path: "/" },
    { label: "Shipping Info", path: "/" },
    { label: "FAQ", path: "/" },
    { label: "Contact Us", path: "/" },
  ],
};

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.58 2.26-.87 3.52-.25 1.05.52 1.91 1.55 1.91 1.86 0 3.3-1.96 3.3-4.8 0-2.51-1.8-4.26-4.38-4.26-2.98 0-4.73 2.23-4.73 4.54 0 .9.34 1.86.78 2.38.09.1.1.19.07.3-.08.33-.26 1.05-.29 1.2-.05.19-.17.23-.38.14-1.39-.65-2.26-2.7-2.26-4.34 0-3.53 2.57-6.78 7.41-6.78 3.89 0 6.91 2.77 6.91 6.47 0 3.86-2.43 6.96-5.8 6.96-1.13 0-2.2-.59-2.57-1.28l-.7 2.61c-.25.97-.93 2.18-1.39 2.92.66.2 1.35.31 2.07.31 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer style={{
      background: "var(--clr-bg-2)",
      borderTop: "1px solid var(--clr-divider)",
      marginTop: "auto",
    }}>
      {/* Newsletter Section */}
      <div style={{
        borderBottom: "1px solid var(--clr-divider)",
        padding: "72px 40px",
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "center",
          }}>
            <div>
              <span style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px", fontWeight: 500,
                letterSpacing: "0.3em", textTransform: "uppercase",
                color: "var(--clr-primary)", display: "block",
                marginBottom: "16px",
              }}>Exclusive Access</span>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 300, lineHeight: 1.1,
                color: "var(--clr-text)",
                marginBottom: "16px",
              }}>
                Join the SUIIS Circle
              </h2>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px", fontWeight: 300,
                color: "var(--clr-text-3)", lineHeight: 1.7,
                maxWidth: "380px",
              }}>
                Be first to know about new launches, exclusive offers, and beauty secrets. Members enjoy 15% off their first order.
              </p>
              <div style={{
                display: "flex", gap: "24px", marginTop: "24px",
              }}>
                {["Free Shipping", "Early Access", "Birthday Gift"].map(perk => (
                  <div key={perk} style={{
                    display: "flex", alignItems: "center", gap: "6px",
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      border: "1px solid var(--clr-primary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span style={{
                      fontFamily: "var(--font-body)", fontSize: "11px",
                      color: "var(--clr-text-3)", letterSpacing: "0.06em",
                    }}>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {subscribed ? (
                <div style={{
                  padding: "32px",
                  border: "1px solid var(--clr-primary)",
                  textAlign: "center",
                  background: "rgba(201,169,110,0.05)",
                }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>✨</div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: "22px",
                    color: "var(--clr-primary)", marginBottom: "8px",
                  }}>Welcome to the Circle!</div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: "13px",
                    color: "var(--clr-text-3)",
                  }}>Check your inbox for your 15% discount code.</div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe}>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{
                      fontFamily: "var(--font-body)", fontSize: "10px",
                      fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase",
                      color: "var(--clr-text-3)", display: "block", marginBottom: "10px",
                    }}>Your Email Address</label>
                    <div style={{ display: "flex" }}>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        style={{
                          flex: 1,
                          padding: "15px 20px",
                          background: "var(--clr-bg-3)",
                          border: "1px solid var(--clr-border-2)",
                          borderRight: "none",
                          color: "var(--clr-text)",
                          fontFamily: "var(--font-body)",
                          fontSize: "14px", fontWeight: 300,
                          outline: "none",
                          transition: "border-color 0.3s",
                        }}
                        onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
                        onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"}
                      />
                      <button
                        type="submit"
                        style={{
                          padding: "15px 28px",
                          background: "var(--clr-primary)",
                          color: "var(--clr-bg)",
                          fontFamily: "var(--font-body)",
                          fontSize: "10px", fontWeight: 600,
                          letterSpacing: "0.18em", textTransform: "uppercase",
                          border: "none", cursor: "pointer",
                          flexShrink: 0, transition: "background 0.3s",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--clr-primary-light)"}
                        onMouseLeave={e => e.currentTarget.style.background = "var(--clr-primary)"}
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "11px",
                    color: "var(--clr-text-muted)", lineHeight: 1.6,
                  }}>
                    By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div style={{ padding: "64px 40px 48px", borderBottom: "1px solid var(--clr-divider)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
            gap: "48px",
          }}>
            {/* Brand Column */}
            <div>
              <div style={{ marginBottom: "24px" }}>
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: "36px",
                  fontWeight: 300, letterSpacing: "0.15em",
                  textTransform: "uppercase", color: "var(--clr-text)",
                }}>Suiis</div>
                <div style={{
                  fontFamily: "var(--font-body)", fontSize: "9px",
                  fontWeight: 500, letterSpacing: "0.35em",
                  textTransform: "uppercase", color: "var(--clr-primary)",
                  marginTop: "2px",
                }}>Beauty</div>
              </div>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "13px",
                fontWeight: 300, color: "var(--clr-text-3)",
                lineHeight: 1.8, marginBottom: "28px",
                maxWidth: "260px",
              }}>
                SUIIS Beauty was born from the belief that every person deserves to feel extraordinary. Luxury beauty for the modern soul.
              </p>
              {/* Trust Badges */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
                {["Cruelty Free", "Vegan", "Clean Beauty"].map(badge => (
                  <span key={badge} style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    border: "1px solid var(--clr-border-2)",
                    fontFamily: "var(--font-body)", fontSize: "9px",
                    fontWeight: 500, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "var(--clr-text-3)",
                  }}>{badge}</span>
                ))}
              </div>
              {/* Socials */}
              <div style={{ display: "flex", gap: "10px" }}>
                {SOCIALS.map(s => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    style={{
                      width: 38, height: 38,
                      border: "1px solid var(--clr-border-2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--clr-text-3)", textDecoration: "none",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "var(--clr-primary)";
                      e.currentTarget.style.color = "var(--clr-primary)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "var(--clr-border-2)";
                      e.currentTarget.style.color = "var(--clr-text-3)";
                    }}
                  >{s.icon}</a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <h4 style={{
                  fontFamily: "var(--font-body)", fontSize: "10px",
                  fontWeight: 600, letterSpacing: "0.25em",
                  textTransform: "uppercase", color: "var(--clr-text)",
                  marginBottom: "24px",
                }}>{heading}</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {links.map(link => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        style={{
                          fontFamily: "var(--font-body)", fontSize: "13px",
                          fontWeight: 300, color: "var(--clr-text-3)",
                          textDecoration: "none", letterSpacing: "0.03em",
                          transition: "color 0.25s ease",
                          display: "inline-block",
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = "var(--clr-primary)"}
                        onMouseLeave={e => e.currentTarget.style.color = "var(--clr-text-3)"}
                      >{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ padding: "24px 40px" }}>
        <div style={{
          maxWidth: "1400px", margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: "16px",
        }}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "12px",
            color: "var(--clr-text-muted)", fontWeight: 300,
          }}>
            © {new Date().getFullYear()} SUIIS Beauty. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(t => (
              <Link
                key={t}
                to="/"
                style={{
                  fontFamily: "var(--font-body)", fontSize: "11px",
                  color: "var(--clr-text-muted)", textDecoration: "none",
                  letterSpacing: "0.06em", transition: "color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--clr-text-3)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--clr-text-muted)"}
              >{t}</Link>
            ))}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-muted)" }}>
              Secure Payments
            </span>
            {["Visa", "MC", "UPI", "RazPay"].map(p => (
              <span key={p} style={{
                padding: "3px 8px",
                border: "1px solid var(--clr-border-2)",
                fontFamily: "var(--font-body)", fontSize: "9px",
                fontWeight: 600, letterSpacing: "0.06em",
                color: "var(--clr-text-3)",
              }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 1024px) {
          footer > div:nth-child(2) > div > div {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 768px) {
          footer > div:nth-child(1) > div > div {
            grid-template-columns: 1fr !important;
          }
          footer > div:nth-child(2) > div > div {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
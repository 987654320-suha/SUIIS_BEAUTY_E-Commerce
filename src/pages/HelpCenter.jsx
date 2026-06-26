import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const FAQS = [
  {
    category: "Orders & Shipping",
    items: [
      { q: "How long does delivery take?", a: "Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available at checkout for select pincodes." },
      { q: "Do you offer free shipping?", a: "Yes! Free shipping on all orders above ₹1,499. For orders below ₹1,499, a flat shipping fee of ₹99 applies." },
      { q: "Can I track my order?", a: "Absolutely! Go to Track Order page or My Orders section. You'll receive real-time updates via SMS and email too." },
      { q: "Can I change or cancel my order?", a: "Orders can be modified or cancelled within 1 hour of placement. After that, please wait for delivery and initiate a return." },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      { q: "What is your return policy?", a: "We offer a hassle-free 15-day return policy from the date of delivery. Products must be unused, in original packaging." },
      { q: "How do I initiate a return?", a: "Visit the Returns page, select your order, choose a reason, and submit. Our team will schedule a free pickup within 48 hours." },
      { q: "How long does refund take?", a: "Refunds are processed within 5–7 business days after we receive the returned product. Amount is credited to your original payment method." },
      { q: "Can I exchange a product?", a: "Yes! You can request a replacement on the Returns page. Select 'Replace Item' and choose the same product in a different shade if available." },
    ],
  },
  {
    category: "Products & Quality",
    items: [
      { q: "Are SUIIS products cruelty-free?", a: "Yes! Every single SUIIS product is 100% cruelty-free and PETA certified. We never test on animals." },
      { q: "Are your products vegan?", a: "Most of our products are vegan. Each product page clearly mentions if it's vegan. We're working towards a fully vegan range." },
      { q: "Are SUIIS products safe for sensitive skin?", a: "Yes! All products are dermatologist-tested and free from parabens, sulfates, mineral oil, and synthetic fragrance." },
      { q: "How do I find my shade?", a: "Visit our Shade Finder tool on each product page. You can also use the Virtual Try-On (AR) feature to see how shades look on you." },
    ],
  },
  {
    category: "Account & Payments",
    items: [
      { q: "What payment methods are accepted?", a: "We accept UPI (GPay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking, Wallets, EMI, and Cash on Delivery." },
      { q: "Is my payment information secure?", a: "Absolutely. All transactions are protected by 256-bit SSL encryption. We never store your card details." },
      { q: "How do Reward Points work?", a: "Earn 10 points for every ₹100 spent. 100 points = ₹10 discount. Points can be redeemed at checkout." },
      { q: "How do I apply a coupon code?", a: "Add items to cart, then enter your coupon code in the 'Coupon Code' field on the Cart page or Checkout. Current codes: SUIIS20, BEAUTY10, FIRST15." },
    ],
  },
];

export default function HelpCenter() {
  const [openCategory, setOpenCategory] = useState("Orders & Shipping");
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [activeTab, setActiveTab] = useState("faq");
  const { toast } = useToast();

  const allFaqs = FAQS.flatMap(c => c.items.map(item => ({ ...item, category: c.category })));
  const filteredFaqs = searchQ.trim()
    ? allFaqs.filter(f => f.q.toLowerCase().includes(searchQ.toLowerCase()) || f.a.toLowerCase().includes(searchQ.toLowerCase()))
    : null;

  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success("Your message has been sent! We'll respond within 24 hours. 💌");
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  const upd = (k, v) => setContactForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "14px", fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>
            <Link to="/" style={{ color: "var(--clr-text-3)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <span style={{ color: "var(--clr-text-2)" }}>Help Center</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,52px)", fontWeight: 300, color: "var(--clr-text)", marginBottom: "8px" }}>
            How can we help you?
          </h1>
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", padding: "0 18px", gap: "10px", maxWidth: "520px", marginTop: "16px", transition: "border-color 0.3s" }}
            onFocusCapture={e => e.currentTarget.style.borderColor = "var(--clr-primary)"}
            onBlurCapture={e => e.currentTarget.style.borderColor = "var(--clr-border-2)"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-text-3)" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search FAQs, topics, or keywords..."
              style={{ flex: 1, padding: "14px 0", background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text)" }} />
            {searchQ && <button onClick={() => setSearchQ("")} style={{ color: "var(--clr-text-3)", fontSize: "18px", background: "none", border: "none", cursor: "pointer" }}>×</button>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 40px 80px" }}>

        {/* Quick Links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "40px" }}>
          {[
            { icon: "📦", label: "Track Order", path: "/track-order" },
            { icon: "↩", label: "Return Item", path: "/returns" },
            { icon: "🛍️", label: "My Orders", path: "/orders" },
            { icon: "💬", label: "Live Chat", action: () => { toast.info("Chat agent connecting..."); } },
          ].map(item => (
            item.path ? (
              <Link key={item.label} to={item.path} style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "22px 16px", background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)",
                textDecoration: "none", gap: "10px", transition: "all 0.25s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-primary)"; e.currentTarget.style.background = "var(--clr-bg-3)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.background = "var(--clr-bg-2)"; }}>
                <span style={{ fontSize: "28px" }}>{item.icon}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, color: "var(--clr-text-2)", letterSpacing: "0.08em" }}>{item.label}</span>
              </Link>
            ) : (
              <button key={item.label} onClick={item.action} style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "22px 16px", background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)",
                gap: "10px", cursor: "pointer", transition: "all 0.25s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-primary)"; e.currentTarget.style.background = "var(--clr-bg-3)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.background = "var(--clr-bg-2)"; }}>
                <span style={{ fontSize: "28px" }}>{item.icon}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, color: "var(--clr-text-2)", letterSpacing: "0.08em" }}>{item.label}</span>
              </button>
            )
          ))}
        </div>

        {/* Tab Nav */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--clr-divider)", marginBottom: "32px" }}>
          {[["faq", "FAQ"], ["contact", "Contact Us"]].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              padding: "13px 28px", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500,
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: activeTab === id ? "var(--clr-primary)" : "var(--clr-text-3)",
              borderBottom: `2px solid ${activeTab === id ? "var(--clr-primary)" : "transparent"}`,
              marginBottom: "-1px", cursor: "pointer", background: "none", border: "none",
              borderBottom: `2px solid ${activeTab === id ? "var(--clr-primary)" : "transparent"}`,
              transition: "all 0.25s",
            }}>{label}</button>
          ))}
        </div>

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <>
            {filteredFaqs ? (
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", marginBottom: "20px" }}>
                  {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""} for "{searchQ}"
                </p>
                {filteredFaqs.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px", background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)" }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}>🔍</div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 300, color: "var(--clr-text-2)", marginBottom: "8px" }}>No results found</h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)" }}>Try different keywords or contact our support team.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    {filteredFaqs.map((faq, i) => (
                      <FaqItem key={i} faq={faq} isOpen={openFaq === `search-${i}`} onToggle={() => setOpenFaq(openFaq === `search-${i}` ? null : `search-${i}`)} showCategory />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "24px" }}>
                {/* Category Sidebar */}
                <div>
                  {FAQS.map(cat => (
                    <button key={cat.category} onClick={() => setOpenCategory(cat.category)} style={{
                      display: "block", width: "100%", padding: "12px 16px", textAlign: "left",
                      background: openCategory === cat.category ? "rgba(201,169,110,0.08)" : "transparent",
                      borderLeft: `2px solid ${openCategory === cat.category ? "var(--clr-primary)" : "transparent"}`,
                      border: "none", cursor: "pointer",
                      fontFamily: "var(--font-body)", fontSize: "13px",
                      color: openCategory === cat.category ? "var(--clr-primary)" : "var(--clr-text-2)",
                      fontWeight: openCategory === cat.category ? 500 : 300,
                      transition: "all 0.2s", marginBottom: "2px",
                    }}>
                      {cat.category}
                    </button>
                  ))}
                </div>
                {/* FAQ List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {FAQS.find(c => c.category === openCategory)?.items.map((faq, i) => (
                    <FaqItem key={i} faq={faq} isOpen={openFaq === `${openCategory}-${i}`} onToggle={() => setOpenFaq(openFaq === `${openCategory}-${i}` ? null : `${openCategory}-${i}`)} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            {/* Contact Form */}
            <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "32px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "6px" }}>Send a Message</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", marginBottom: "24px" }}>We respond within 24 hours.</p>
              <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { k: "name", l: "Your Name", p: "Priya Sharma", t: "text" },
                  { k: "email", l: "Email Address", p: "name@example.com", t: "email" },
                  { k: "subject", l: "Subject", p: "Order query, Return request...", t: "text" },
                ].map(f => (
                  <div key={f.k}>
                    <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "7px" }}>{f.l}</label>
                    <input type={f.t} value={contactForm[f.k]} onChange={e => upd(f.k, e.target.value)} placeholder={f.p} required
                      style={{ width: "100%", padding: "11px 14px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                      onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
                      onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
                  </div>
                ))}
                <div>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "7px" }}>Message</label>
                  <textarea value={contactForm.message} onChange={e => upd("message", e.target.value)} placeholder="Describe your issue in detail..." required rows={5}
                    style={{ width: "100%", padding: "11px 14px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none", boxSizing: "border-box", resize: "vertical", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
                    onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
                </div>
                <button type="submit" style={{ padding: "13px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", transition: "background 0.3s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--clr-primary-light)"} onMouseLeave={e => e.currentTarget.style.background = "var(--clr-primary)"}>
                  Send Message →
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { icon: "💬", title: "Live Chat", desc: "Chat with our beauty experts", detail: "Mon–Sat: 9AM – 8PM IST", action: "Start Chat", onClick: () => toast.info("Connecting to agent...") },
                { icon: "📞", title: "Phone Support", desc: "Call us directly", detail: "+91 1800-SUIIS-1 (Toll Free)", action: "Call Now", onClick: () => toast.info("Calling...") },
                { icon: "📧", title: "Email Support", desc: "Write to us anytime", detail: "support@suiisbeauty.com", action: "Email Us", onClick: () => toast.info("Opening email...") },
                { icon: "💌", title: "WhatsApp", desc: "Message us on WhatsApp", detail: "+91 9876 543 210", action: "WhatsApp", onClick: () => toast.info("Opening WhatsApp...") },
              ].map(c => (
                <div key={c.title} style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "20px 22px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "24px", flexShrink: 0, marginTop: "2px" }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, color: "var(--clr-text)", marginBottom: "2px" }}>{c.title}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", marginBottom: "4px" }}>{c.desc}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-primary)", marginBottom: "10px", fontWeight: 500 }}>{c.detail}</div>
                    <button onClick={c.onClick} style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, color: "var(--clr-primary)", background: "none", border: "1px solid rgba(201,169,110,0.3)", padding: "5px 14px", cursor: "pointer", letterSpacing: "0.1em", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-bg)"; }} onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--clr-primary)"; }}>
                      {c.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FaqItem({ faq, isOpen, onToggle, showCategory }) {
  return (
    <div style={{ background: isOpen ? "var(--clr-bg-3)" : "var(--clr-bg-2)", border: `1px solid ${isOpen ? "var(--clr-border)" : "var(--clr-border-2)"}`, transition: "all 0.25s" }}>
      <button onClick={onToggle} style={{ width: "100%", padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "16px" }}>
        <div>
          {showCategory && <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-primary)", display: "block", marginBottom: "3px" }}>{faq.category}</span>}
          <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: isOpen ? 500 : 300, color: isOpen ? "var(--clr-primary)" : "var(--clr-text)", lineHeight: 1.4 }}>{faq.q}</span>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isOpen ? "var(--clr-primary)" : "var(--clr-text-3)"} strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <div style={{ padding: "0 20px 18px" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 300, color: "var(--clr-text-2)", lineHeight: 1.75 }}>{faq.a}</p>
        </div>
      )}
    </div>
  );
}
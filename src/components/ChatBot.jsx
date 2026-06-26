import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BOT_RESPONSES = {
  greet: ["Hello! Welcome to SUIIS Beauty 💄 How can I help you today?", "Hi there! I'm your SUIIS beauty assistant. What are you looking for?"],
  lips: ["Our lip collection includes matte lipsticks, glosses, and liquid lipsticks! 💋 Our bestseller is the Velvet Noir Matte Lipstick at ₹849.", "Check out our Luxe Liquid Velvet Lip - it lasts 16 hours and comes in stunning shades! ₹949."],
  eyes: ["Our eye range features the Noir Dramatique 18-pan palette, precision eyeliner, and volumizing mascara! 👁", "The Noir Dramatique Eye Palette at ₹1699 is our #1 bestseller. Amazing pigment!"],
  skin: ["Our Radiance Revival Serum with 10% Vitamin C is transforming skin! ✨ ₹2299. Also try our Velvet Cloud Moisturizer!", "For skincare, I recommend starting with our Radiance Revival Serum and Velvet Cloud Moisturizer combo."],
  order: ["You can track your order at /track-order. Need your order ID? Check your email or the Orders section in your profile!", "Visit /orders to see all your orders and tracking details. Need help with a specific order?"],
  shipping: ["Free shipping on orders above ₹1499! 🚚 Standard delivery takes 3-5 business days.", "We offer free shipping above ₹1499. Express delivery also available at checkout!"],
  return: ["Easy 15-day returns! Visit /returns to initiate a return request. Refunds processed in 5-7 business days.", "You can return products within 15 days of delivery. Visit the Returns section for a hassle-free process!"],
  coupon: ["Try SUIIS20 for 20% off, BEAUTY10 for 10% off, or FIRST15 for 15% off your first order! 🎟", "Current codes: SUIIS20 (20% off), BEAUTY10 (10% off). Free shipping above ₹1499!"],
  default: ["I'm here to help! You can ask about products, orders, shipping, returns, or coupons. 😊", "Great question! Feel free to ask me about our products, delivery, returns, or anything beauty-related!", "I'd love to help! Try asking about our bestsellers, ongoing offers, or order status."],
};

const getResponse = (msg) => {
  const lower = msg.toLowerCase();
  if (/hello|hi|hey|namaste/i.test(lower)) return BOT_RESPONSES.greet;
  if (/lip|lipstick|gloss/i.test(lower)) return BOT_RESPONSES.lips;
  if (/eye|mascara|palette|liner|brow/i.test(lower)) return BOT_RESPONSES.eyes;
  if (/skin|serum|moistur|cream|cleanser/i.test(lower)) return BOT_RESPONSES.skin;
  if (/order|track|status/i.test(lower)) return BOT_RESPONSES.order;
  if (/ship|deliver|dispatch/i.test(lower)) return BOT_RESPONSES.shipping;
  if (/return|refund|exchange/i.test(lower)) return BOT_RESPONSES.return;
  if (/coupon|code|discount|offer|promo/i.test(lower)) return BOT_RESPONSES.coupon;
  return BOT_RESPONSES.default;
};

const QUICK_REPLIES = ["Bestsellers", "Track Order", "Coupon Codes", "Return Policy", "Lip Products", "Skincare", "Contact Support"];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hi! I'm SUIIS Beauty Assistant 💄 How can I help you today?", time: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: "user", text: text.trim(), time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const responses = getResponse(text);
      const botReply = responses[Math.floor(Math.random() * responses.length)];
      setTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, from: "bot", text: botReply, time: new Date() }]);
      if (!open) setUnread(n => n + 1);
    }, 900 + Math.random() * 600);
  };

  const formatTime = (d) => d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 8000,
          width: 56, height: 56, borderRadius: "50%",
          background: "var(--clr-primary)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px rgba(201,169,110,0.4)",
          transition: "all 0.3s var(--ease-bounce)",
          transform: open ? "scale(0.9) rotate(20deg)" : "scale(1)",
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.transform = "scale(1.08)"; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.transform = "scale(1)"; }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--clr-bg)" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--clr-bg)" strokeWidth="1.8" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {unread > 0 && !open && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            width: 18, height: 18, borderRadius: "50%",
            background: "#e87070", color: "white",
            fontSize: "10px", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-body)", border: "2px solid var(--clr-bg)",
          }}>{unread}</span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 28, zIndex: 8000,
          width: 360, height: 520,
          background: "var(--clr-bg-2)",
          border: "1px solid var(--clr-border)",
          display: "flex", flexDirection: "column",
          boxShadow: "var(--shadow-lg)",
          animation: "slideUpChat 0.35s var(--ease-out-expo)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "16px 20px",
            background: "var(--clr-primary)",
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(10,10,10,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px",
            }}>💄</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--clr-bg)" }}>
                SUIIS Beauty Assistant
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7ec88a", display: "block" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(10,10,10,0.7)" }}>Online</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ color: "rgba(10,10,10,0.6)", fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: "flex", flexDirection: "column",
                alignItems: msg.from === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "80%", padding: "10px 14px",
                  background: msg.from === "user" ? "var(--clr-primary)" : "var(--clr-bg-3)",
                  color: msg.from === "user" ? "var(--clr-bg)" : "var(--clr-text)",
                  fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 300,
                  lineHeight: 1.5,
                  borderRadius: msg.from === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0",
                  border: msg.from === "bot" ? "1px solid var(--clr-border-2)" : "none",
                }}>
                  {msg.text}
                </div>
                <span style={{
                  fontFamily: "var(--font-body)", fontSize: "10px",
                  color: "var(--clr-text-muted)", marginTop: "3px",
                }}>{formatTime(msg.time)}</span>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <div style={{
                  padding: "10px 14px", background: "var(--clr-bg-3)",
                  border: "1px solid var(--clr-border-2)",
                  borderRadius: "12px 12px 12px 0",
                  display: "flex", gap: "4px", alignItems: "center",
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "var(--clr-primary)",
                      animation: `typingDot 1.2s ${i * 0.2}s ease-in-out infinite`,
                      display: "block",
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          <div style={{
            padding: "8px 12px", borderTop: "1px solid var(--clr-divider)",
            display: "flex", gap: "6px", flexWrap: "wrap", overflowX: "auto",
          }}>
            {QUICK_REPLIES.map(qr => (
              <button
                key={qr}
                onClick={() => sendMessage(qr)}
                style={{
                  padding: "4px 10px",
                  border: "1px solid var(--clr-primary)",
                  background: "transparent", color: "var(--clr-primary)",
                  fontFamily: "var(--font-body)", fontSize: "10px",
                  fontWeight: 500, letterSpacing: "0.06em",
                  cursor: "pointer", borderRadius: "12px",
                  transition: "all 0.2s", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-bg)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--clr-primary)"; }}
              >{qr}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 16px",
            borderTop: "1px solid var(--clr-divider)",
            display: "flex", gap: "10px",
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask me anything..."
              style={{
                flex: 1, padding: "10px 14px",
                background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)",
                color: "var(--clr-text)", fontFamily: "var(--font-body)",
                fontSize: "13px", outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
              onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              style={{
                width: 38, height: 38, borderRadius: "50%",
                background: input.trim() ? "var(--clr-primary)" : "var(--clr-bg-3)",
                border: "none", cursor: input.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.2s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={input.trim() ? "var(--clr-bg)" : "var(--clr-text-muted)"}
                strokeWidth="2" strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUpChat { from { opacity:0; transform: translateY(20px) scale(0.95); } to { opacity:1; transform: translateY(0) scale(1); } }
        @keyframes typingDot { 0%,60%,100% { transform: translateY(0); opacity:0.4; } 30% { transform: translateY(-4px); opacity:1; } }
      `}</style>
    </>
  );
}
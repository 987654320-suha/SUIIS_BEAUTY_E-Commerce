import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useOrders } from "../context/OrderContext";
import { useRewards } from "../context/RewardsContext";

const MENU = [
  { id: "profile", label: "My Profile", icon: "👤" },
  { id: "orders", label: "My Orders", icon: "📦", path: "/orders" },
  { id: "wishlist", label: "Wishlist", icon: "❤️", path: "/wishlist" },
  { id: "address", label: "Address Book", icon: "📍", path: "/address-book" },
  { id: "rewards", label: "Rewards & Points", icon: "⭐", path: "/rewards" },
  { id: "security", label: "Security", icon: "🔒" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
];

function PageLayout({ title, subtitle, children }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)" }}>
      <div style={{ borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "14px", fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>
            <Link to="/" style={{ color: "var(--clr-text-3)", textDecoration: "none" }}>Home</Link><span>/</span>
            <span style={{ color: "var(--clr-text-2)" }}>Account</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: "var(--clr-text)", marginBottom: "4px" }}>{title}</h1>
          {subtitle && <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)" }}>{subtitle}</p>}
        </div>
      </div>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "44px 40px 80px" }}>{children}</div>
    </div>
  );
}

export default function Profile() {
  const { user, logout, updateProfile, loading } = useAuth();
  const { toast } = useToast();
  const { orders } = useOrders();
  const { points, currentTier } = useRewards();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  const [passwords, setPasswords] = useState({ current: "", newP: "", confirm: "" });
  const [notifs, setNotifs] = useState({ email: true, sms: true, push: false, offers: true, orders: true, news: false });

  if (!user) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
        <div style={{ fontSize: "64px", opacity: 0.2 }}>👤</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 300, color: "var(--clr-text-2)" }}>Please sign in</h2>
        <Link to="/login" style={{ padding: "13px 32px", background: "var(--clr-primary)", color: "var(--clr-bg)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>Sign In</Link>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    const res = await updateProfile(form);
    if (res.success) toast.success("Profile updated successfully!");
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out. See you soon! 👋");
    navigate("/");
  };

  const Input = ({ label, value, onChange, type = "text", placeholder }) => (
    <div>
      <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "7px" }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: "100%", padding: "12px 14px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
        onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
    </div>
  );

  return (
    <PageLayout title="My Account" subtitle={`Welcome back, ${user.name}`}>
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "32px", alignItems: "start" }}>

        {/* Sidebar */}
        <aside style={{ position: "sticky", top: 92 }}>
          {/* Avatar */}
          <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "24px", textAlign: "center", marginBottom: "12px" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(201,169,110,0.15)", border: "2px solid var(--clr-primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--clr-primary)", fontWeight: 500 }}>
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--clr-text)", marginBottom: "2px" }}>{user.name}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", marginBottom: "8px" }}>{user.email}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.3)" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", color: "var(--clr-primary)" }}>⭐ {currentTier?.name} · {points} pts</span>
            </div>
          </div>

          {/* Nav */}
          <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", overflow: "hidden" }}>
            {MENU.map(item => (
              item.path ? (
                <Link key={item.id} to={item.path} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "13px 18px", borderBottom: "1px solid var(--clr-divider)", textDecoration: "none", color: "var(--clr-text-2)", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 300, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--clr-bg-3)"; e.currentTarget.style.color = "var(--clr-primary)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--clr-text-2)"; }}>
                  <span>{item.icon}</span>{item.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginLeft: "auto", opacity: 0.4 }}><polyline points="9 18 15 12 9 6" /></svg>
                </Link>
              ) : (
                <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "13px 18px", borderBottom: "1px solid var(--clr-divider)", width: "100%", background: activeTab === item.id ? "rgba(201,169,110,0.08)" : "transparent", borderLeft: `2px solid ${activeTab === item.id ? "var(--clr-primary)" : "transparent"}`, color: activeTab === item.id ? "var(--clr-primary)" : "var(--clr-text-2)", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: activeTab === item.id ? 500 : 300, cursor: "pointer", transition: "all 0.2s", textAlign: "left" }}>
                  <span>{item.icon}</span>{item.label}
                </button>
              )
            ))}
            <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "13px 18px", width: "100%", background: "transparent", border: "none", color: "#e87070", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400, cursor: "pointer", transition: "background 0.2s", textAlign: "left" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(232,112,112,0.07)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <span>🚪</span> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div>
          {activeTab === "profile" && (
            <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "36px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "8px" }}>Personal Information</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", marginBottom: "28px" }}>Update your personal details and preferences.</p>

              {/* Stats Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--clr-divider)", border: "1px solid var(--clr-divider)", marginBottom: "32px" }}>
                {[["📦", orders.length, "Total Orders"], ["⭐", points, "Reward Points"], ["❤️", "—", "Wishlist Items"]].map(([ic, v, l]) => (
                  <div key={l} style={{ padding: "20px", background: "var(--clr-bg-3)", textAlign: "center" }}>
                    <div style={{ fontSize: "22px", marginBottom: "6px" }}>{ic}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 500, color: "var(--clr-primary)", marginBottom: "2px" }}>{v}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{l}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "24px" }}>
                <Input label="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Priya Sharma" />
                <Input label="Email Address" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} type="email" placeholder="name@email.com" />
                <Input label="Phone Number" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} type="tel" placeholder="9876543210" />
                <div>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "7px" }}>Member Since</label>
                  <div style={{ padding: "12px 14px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text-3)", fontFamily: "var(--font-body)", fontSize: "14px" }}>{user.joinDate || "January 2024"}</div>
                </div>
              </div>
              <button onClick={handleSaveProfile} disabled={loading} style={{ padding: "13px 36px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", transition: "background 0.3s", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "36px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "8px" }}>Security Settings</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", marginBottom: "28px" }}>Keep your account safe.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "420px" }}>
                <Input label="Current Password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} type="password" placeholder="••••••••" />
                <Input label="New Password" value={passwords.newP} onChange={e => setPasswords(p => ({ ...p, newP: e.target.value }))} type="password" placeholder="Min. 8 characters" />
                <Input label="Confirm New Password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} type="password" placeholder="Repeat new password" />
                <button onClick={() => { toast.success("Password updated successfully!"); setPasswords({ current: "", newP: "", confirm: "" }); }} style={{ padding: "13px 32px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", alignSelf: "flex-start" }}>Update Password</button>
              </div>

              <div style={{ marginTop: "36px", paddingTop: "28px", borderTop: "1px solid var(--clr-divider)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "16px" }}>Two-Factor Authentication</h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "var(--clr-text)", marginBottom: "3px" }}>SMS Verification</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>Secure your account with OTP login</div>
                  </div>
                  <button onClick={() => toast.success("2FA enabled!")} style={{ padding: "8px 18px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em" }}>Enable</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "36px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "8px" }}>Notification Preferences</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", marginBottom: "28px" }}>Choose how you want to hear from us.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--clr-divider)" }}>
                {[["email", "📧", "Email Notifications", "Receive updates via email"], ["sms", "📱", "SMS Notifications", "Get text messages for orders"], ["push", "🔔", "Push Notifications", "Browser & app notifications"], ["offers", "🎟", "Exclusive Offers", "Deals, discounts & flash sales"], ["orders", "📦", "Order Updates", "Shipping and delivery alerts"], ["news", "📰", "New Arrivals", "Be first to know about launches"]].map(([key, ic, title, desc]) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", background: "var(--clr-bg-3)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <span style={{ fontSize: "20px" }}>{ic}</span>
                      <div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, color: "var(--clr-text)" }}>{title}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", marginTop: "1px" }}>{desc}</div>
                      </div>
                    </div>
                    <button onClick={() => setNotifs(p => ({ ...p, [key]: !p[key] }))} style={{ width: 44, height: 24, borderRadius: 12, background: notifs[key] ? "var(--clr-primary)" : "var(--clr-bg-2)", border: `1px solid ${notifs[key] ? "var(--clr-primary)" : "var(--clr-border)"}`, position: "relative", cursor: "pointer", transition: "all 0.3s", flexShrink: 0 }}>
                      <span style={{ position: "absolute", top: 2, left: notifs[key] ? 22 : 2, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.3s", display: "block" }} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => toast.success("Notification preferences saved!")} style={{ marginTop: "24px", padding: "13px 32px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>Save Preferences</button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
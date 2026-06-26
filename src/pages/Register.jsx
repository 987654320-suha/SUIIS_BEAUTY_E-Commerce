import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "", agree: false });
  const [showPass, setShowPass] = useState(false);
  const { register, loginWithGoogle, loginWithFacebook, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    console.log("REGISTER DATA:", {
  name: form.name,
  email: form.email,
  phone: form.phone,
  password: form.password,
});
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) { toast.error("Please fill all fields"); return; }
    if (form.password !== form.confirm) { toast.error("Passwords don't match"); return; }
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (!form.agree) { toast.error("Please accept Terms & Conditions"); return; }
    const res = await register({
  name: form.name,
  email: form.email,
  phone: form.phone,
  password: form.password
});
    if (res.success) { toast.success("Account created! Welcome to SUIIS! 💄"); navigate("/"); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)", display: "flex", alignItems: "stretch" }}>
      {/* Left Panel */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }} className="hide-mobile">
        <img src="https://images.unsplash.com/photo-1607346705624-8a9c9d2b7f6e?w=900&q=85" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(201,169,110,0.12) 100%)" }} />
        <div style={{ position: "relative", textAlign: "center", padding: "40px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "56px", fontWeight: 300, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text)" }}>Join SUIIS</div>
          <div style={{ width: 48, height: 1, background: "var(--clr-primary)", margin: "20px auto" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
            {["15% off your first order", "Free shipping above ₹1499", "Earn reward points", "Early access to new launches", "Birthday gifts & surprises"].map(p => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "var(--clr-primary)", fontSize: "14px" }}>✦</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(245,240,234,0.8)", fontWeight: 300 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div style={{ width: "min(500px, 100%)", background: "var(--clr-bg-2)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 48px", borderLeft: "1px solid var(--clr-divider)", overflowY: "auto" }}>
        <Link to="/" style={{ display: "inline-block", marginBottom: "32px", textDecoration: "none" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 300, letterSpacing: "0.15em", color: "var(--clr-text)" }}>Suiis <span style={{ color: "var(--clr-primary)", fontSize: "16px" }}>Beauty</span></div>
        </Link>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 300, color: "var(--clr-text)", marginBottom: "6px" }}>Create Account</h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", fontWeight: 300, marginBottom: "28px" }}>Join the SUIIS Beauty community</p>

        {/* Social */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: "Google", bg: "#fff", tc: "#444", onClick: async () => { const r = await loginWithGoogle(); if (r.success) { toast.success("Welcome! 💄"); navigate("/"); } } },
            { label: "Facebook", bg: "#1877F2", tc: "#fff", onClick: async () => { const r = await loginWithFacebook(); if (r.success) { toast.success("Welcome! 💄"); navigate("/"); } } },
          ].map(s => (
            <button key={s.label} onClick={s.onClick} style={{ flex: 1, padding: "11px", background: s.bg, color: s.tc, border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500 }}>{s.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: 1, background: "var(--clr-divider)" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-muted)" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "var(--clr-divider)" }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { key: "name", label: "Full Name", type: "text", placeholder: "Priya Sharma" },
            { key: "email", label: "Email Address", type: "email", placeholder: "name@example.com" },
            { key: "phone", label: "Phone Number", type: "tel", placeholder: "9876543210" },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "6px" }}>{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => update(f.key, e.target.value)} placeholder={f.placeholder} required
                style={{ width: "100%", padding: "12px 14px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
                onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
            </div>
          ))}

          {[["password", "Password", "Min. 8 characters"], ["confirm", "Confirm Password", "Repeat your password"]].map(([k, l, p]) => (
            <div key={k}>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "6px" }}>{l}</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={form[k]} onChange={e => update(k, e.target.value)} placeholder={p} required
                  style={{ width: "100%", padding: "12px 44px 12px 14px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
                  onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
                {k === "password" && <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--clr-text-3)", background: "none", border: "none", cursor: "pointer", fontSize: "11px", fontFamily: "var(--font-body)" }}>{showPass ? "Hide" : "Show"}</button>}
              </div>
            </div>
          ))}

          <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
            <input type="checkbox" checked={form.agree} onChange={e => update("agree", e.target.checked)} style={{ marginTop: 2, accentColor: "var(--clr-primary)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", lineHeight: 1.5 }}>
              I agree to the <Link to="/" style={{ color: "var(--clr-primary)" }}>Terms of Service</Link> and <Link to="/" style={{ color: "var(--clr-primary)" }}>Privacy Policy</Link>
            </span>
          </label>

          <button type="submit" disabled={loading} style={{
            padding: "15px", background: "var(--clr-primary)", color: "var(--clr-bg)",
            border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600,
            letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "4px",
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", textAlign: "center", marginTop: "24px", fontWeight: 300 }}>
          Already have an account? <Link to="/login" style={{ color: "var(--clr-primary)", fontWeight: 500, textDecoration: "none" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
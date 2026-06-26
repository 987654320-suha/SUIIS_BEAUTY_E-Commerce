import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const [mode, setMode] = useState("email"); // email | otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { login, loginWithGoogle, loginWithFacebook, sendOTP, verifyOTP, loading, otpSent } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill all fields"); return; }
    const res = await login(email, password);
    if (res.success) { toast.success("Welcome back! 💄"); navigate("/"); }
    else toast.error("Invalid credentials");
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) { toast.error("Enter valid phone number"); return; }
    await sendOTP(phone);
    toast.success("OTP sent to " + phone + " (use 123456)");
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const res = await verifyOTP(otp);
    if (res.success) { toast.success("Login successful! 💄"); navigate("/"); }
    else toast.error(res.error);
  };

  const handleGoogle = async () => {
    const res = await loginWithGoogle();
    if (res.success) { toast.success("Logged in with Google! 💄"); navigate("/"); }
  };

  const handleFacebook = async () => {
    const res = await loginWithFacebook();
    if (res.success) { toast.success("Logged in with Facebook! 💄"); navigate("/"); }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--clr-bg)",
      display: "flex", alignItems: "stretch",
    }}>
      {/* Left Decorative Panel */}
      <div style={{
        flex: 1, position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
      }} className="hide-mobile">
        <img
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=85"
          alt="SUIIS Beauty"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(201,169,110,0.15) 100%)",
        }} />
        <div style={{ position: "relative", textAlign: "center", padding: "40px" }}>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: "64px",
            fontWeight: 300, letterSpacing: "0.15em",
            textTransform: "uppercase", color: "var(--clr-text)",
          }}>Suiis</div>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: "11px",
            fontWeight: 500, letterSpacing: "0.35em",
            textTransform: "uppercase", color: "var(--clr-primary)", marginTop: "4px",
          }}>Beauty</div>
          <div style={{
            width: 48, height: 1, background: "var(--clr-primary)",
            margin: "24px auto",
          }} />
          <p style={{
            fontFamily: "var(--font-display)", fontSize: "22px",
            fontWeight: 300, fontStyle: "italic",
            color: "rgba(245,240,234,0.8)", lineHeight: 1.5, maxWidth: "280px",
          }}>
            "Beauty begins the moment you decide to be yourself."
          </p>
        </div>
      </div>

      {/* Right Login Form */}
      <div style={{
        width: "min(480px, 100%)", background: "var(--clr-bg-2)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 48px",
        borderLeft: "1px solid var(--clr-divider)",
      }}>
        <Link to="/" style={{ display: "inline-block", marginBottom: "40px", textDecoration: "none" }}>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: "28px",
            fontWeight: 300, letterSpacing: "0.15em", color: "var(--clr-text)",
          }}>Suiis <span style={{ color: "var(--clr-primary)", fontSize: "20px" }}>Beauty</span></div>
        </Link>

        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "36px",
          fontWeight: 300, color: "var(--clr-text)", marginBottom: "8px",
        }}>Welcome Back</h1>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "14px",
          color: "var(--clr-text-3)", fontWeight: 300, marginBottom: "32px",
        }}>
          Sign in to your SUIIS account
        </p>

        {/* Mode Toggle */}
        <div style={{ display: "flex", border: "1px solid var(--clr-border-2)", marginBottom: "28px" }}>
          {[["email", "Email / Password"], ["otp", "Phone OTP"]].map(([m, l]) => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "11px", background: mode === m ? "var(--clr-primary)" : "transparent",
              color: mode === m ? "var(--clr-bg)" : "var(--clr-text-3)",
              border: "none", cursor: "pointer",
              fontFamily: "var(--font-body)", fontSize: "11px",
              fontWeight: 500, letterSpacing: "0.12em", transition: "all 0.25s",
            }}>{l}</button>
          ))}
        </div>

        {/* Social Login */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          {[
            {
              label: "Google", color: "#fff", textColor: "#444",
              icon: <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>,
              onClick: handleGoogle,
            },
            {
              label: "Facebook", color: "#1877F2", textColor: "#fff",
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
              onClick: handleFacebook,
            },
          ].map(s => (
            <button key={s.label} onClick={s.onClick} disabled={loading} style={{
              flex: 1, padding: "12px", display: "flex", alignItems: "center",
              justifyContent: "center", gap: "8px",
              background: s.color, color: s.textColor, border: "1px solid var(--clr-border-2)",
              cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "12px",
              fontWeight: 500, transition: "opacity 0.2s",
              opacity: loading ? 0.6 : 1,
            }}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ flex: 1, height: 1, background: "var(--clr-divider)" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-muted)", letterSpacing: "0.1em" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "var(--clr-divider)" }} />
        </div>

        {/* Email Login Form */}
        {mode === "email" && (
          <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "8px" }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required
                style={{ width: "100%", padding: "13px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
                onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "8px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required
                  style={{ width: "100%", padding: "13px 44px 13px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
                  onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--clr-text-3)", background: "none", border: "none", cursor: "pointer", fontSize: "12px", fontFamily: "var(--font-body)" }}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link to="/forgot-password" style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-primary)", textDecoration: "none" }}>Forgot Password?</Link>
            </div>
            <button type="submit" disabled={loading} style={{
              padding: "15px", background: "var(--clr-primary)", color: "var(--clr-bg)",
              border: "none", cursor: loading ? "wait" : "pointer",
              fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600,
              letterSpacing: "0.2em", textTransform: "uppercase",
              transition: "background 0.3s", opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        )}

        {/* OTP Login Form */}
        {mode === "otp" && (
          <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "8px" }}>Phone Number</label>
              <div style={{ display: "flex" }}>
                <span style={{ padding: "13px 14px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", borderRight: "none", color: "var(--clr-text-3)", fontFamily: "var(--font-body)", fontSize: "14px", flexShrink: 0 }}>+91</span>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" required disabled={otpSent}
                  style={{ flex: 1, padding: "13px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none" }} />
              </div>
            </div>
            {otpSent && (
              <div>
                <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "8px" }}>Enter OTP <span style={{ color: "var(--clr-primary)" }}>(Demo: 123456)</span></label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="• • • • • •" required maxLength={6}
                  style={{ width: "100%", padding: "13px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-primary)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "20px", textAlign: "center", letterSpacing: "0.3em", outline: "none", boxSizing: "border-box" }} />
              </div>
            )}
            <button type="submit" disabled={loading} style={{
              padding: "15px", background: "var(--clr-primary)", color: "var(--clr-bg)",
              border: "none", cursor: "pointer",
              fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600,
              letterSpacing: "0.2em", textTransform: "uppercase", opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Please wait..." : otpSent ? "Verify OTP" : "Send OTP"}
            </button>
            {otpSent && <button type="button" onClick={() => { sendOTP(phone); toast.success("OTP resent!"); }} style={{ background: "none", border: "none", color: "var(--clr-primary)", fontFamily: "var(--font-body)", fontSize: "12px", cursor: "pointer", textAlign: "center" }}>Resend OTP</button>}
          </form>
        )}

        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", textAlign: "center", marginTop: "28px", fontWeight: 300 }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--clr-primary)", fontWeight: 500, textDecoration: "none" }}>Create Account</Link>
        </p>
      </div>
    </div>
  );
}
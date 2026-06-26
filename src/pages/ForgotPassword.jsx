import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { forgotPassword, loading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    await forgotPassword(email);
    setSent(true);
    toast.success("Reset link sent to " + email);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
      <div style={{ width: "100%", maxWidth: 440, background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "56px 48px" }}>
        <Link to="/" style={{ textDecoration: "none", display: "block", marginBottom: "32px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 300, letterSpacing: "0.15em", color: "var(--clr-text)" }}>
            Suiis <span style={{ color: "var(--clr-primary)" }}>Beauty</span>
          </div>
        </Link>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>📧</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "var(--clr-text)", marginBottom: "12px" }}>Check Your Email</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text-3)", lineHeight: 1.7, marginBottom: "28px" }}>
              We've sent a password reset link to <strong style={{ color: "var(--clr-primary)" }}>{email}</strong>. Please check your inbox.
            </p>
            <Link to="/login" style={{
              display: "block", padding: "14px",
              background: "var(--clr-primary)", color: "var(--clr-bg)",
              textDecoration: "none", fontFamily: "var(--font-body)",
              fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase",
              textAlign: "center",
            }}>Back to Login</Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 300, color: "var(--clr-text)", marginBottom: "8px" }}>Forgot Password?</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", fontWeight: 300, marginBottom: "32px", lineHeight: 1.6 }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "8px" }}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required
                  style={{ width: "100%", padding: "13px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
                  onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
              </div>
              <button type="submit" disabled={loading} style={{
                padding: "15px", background: "var(--clr-primary)", color: "var(--clr-bg)",
                border: "none", cursor: "pointer", fontFamily: "var(--font-body)",
                fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase",
                opacity: loading ? 0.7 : 1,
              }}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <Link to="/login" style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", textAlign: "center", textDecoration: "none" }}>
                ← Back to Login
              </Link>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import axios from "axios";

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [otpMethod, setOtpMethod] = useState("email");
  const [loading, setLoading] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // OTP form state
  const [otpEmail, setOtpEmail] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  
  const { login, register, sendOTP, verifyOTP, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle normal login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please enter email and password");
      return;
    }
    
    setLoading(true);
    const result = await login(loginEmail, loginPassword);
    setLoading(false);
    
    if (result.success) {
      toast.success("Welcome back! 🎉");
      navigate("/");
    } else {
      toast.error(result.error || "Invalid credentials. Please check your email and password.");
    }
  };

  // Handle OTP send
  const handleSendOTP = async () => {
    if (otpMethod === "email" && !otpEmail) {
      toast.error("Please enter your email");
      return;
    }
    if (otpMethod === "phone" && !otpPhone) {
      toast.error("Please enter your phone number");
      return;
    }
    
    setLoading(true);
    const payload = otpMethod === "email" ? { email: otpEmail } : { phone: otpPhone };
    const result = await sendOTP(payload);
    setLoading(false);
    
    if (result.success) {
      setOtpSent(true);
      toast.success(`OTP sent to your ${otpMethod}`);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error("Please enter valid 6-digit OTP");
      return;
    }
    
    setLoading(true);
    const payload = otpMethod === "email" 
      ? { email: otpEmail, otp: otpCode }
      : { phone: otpPhone, otp: otpCode };
    const result = await verifyOTP(payload);
    setLoading(false);
    
    if (result.success) {
      toast.success("Login successful!");
      navigate("/");
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!regName || !regEmail || !regPhone || !regPassword) {
      toast.error("Please fill all fields");
      return;
    }
    
    if (regPassword !== regConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (regPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    const result = await register({ 
      name: regName, 
      email: regEmail, 
      phone: regPhone, 
      password: regPassword 
    });
    setLoading(false);
    
    if (result.success) {
      toast.success("Registration successful! Please check your email to verify your account.");
      setIsLogin(true);
      // Clear form
      setRegName("");
      setRegEmail("");
      setRegPhone("");
      setRegPassword("");
      setRegConfirmPassword("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)", display: "flex", alignItems: "stretch" }}>
      {/* Left Side - Brand Section */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }} className="hide-mobile">
        <img 
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=85" 
          alt="SUIIS Beauty" 
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} 
        />
        <div style={{ 
          position: "absolute", inset: 0, 
          background: "linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(201,169,110,0.15) 100%)" 
        }} />
        <div style={{ position: "relative", textAlign: "center", padding: "40px", maxWidth: "500px" }}>
          <div style={{ 
            fontFamily: "var(--font-display)", fontSize: "64px", fontWeight: 300, 
            letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text)" 
          }}>Suiis</div>
          <div style={{ 
            fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, 
            letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--clr-primary)", marginTop: "4px" 
          }}>Beauty</div>
          <div style={{ width: "48px", height: "1px", background: "var(--clr-primary)", margin: "24px auto" }} />
          <p style={{ 
            fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 300, 
            fontStyle: "italic", color: "rgba(245,240,234,0.8)", lineHeight: 1.5 
          }}>
            "Beauty begins the moment you decide to be yourself."
          </p>
          <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
            {["Cruelty Free", "Clean Formulas", "Luxury Experience", "Made with Love"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "var(--clr-primary)", fontSize: "14px" }}>✦</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(245,240,234,0.7)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div style={{ 
        width: "min(500px, 100%)", background: "var(--clr-bg-2)", 
        display: "flex", flexDirection: "column", justifyContent: "center", 
        padding: "60px 48px", borderLeft: "1px solid var(--clr-divider)", overflowY: "auto" 
      }}>
        {/* Logo for mobile */}
        <div style={{ textAlign: "center", marginBottom: "32px" }} className="show-mobile-only">
          <div style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 300, letterSpacing: "0.15em", color: "var(--clr-text)" }}>Suiis Beauty</div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--clr-divider)", marginBottom: "32px" }}>
          <button 
            onClick={() => { setIsLogin(true); setShowOTP(false); setOtpSent(false); }}
            style={{ 
              flex: 1, padding: "14px", background: "none", border: "none", 
              borderBottom: `2px solid ${isLogin && !showOTP ? "var(--clr-primary)" : "transparent"}`,
              color: isLogin && !showOTP ? "var(--clr-primary)" : "var(--clr-text-3)",
              fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500,
              letterSpacing: "0.1em", cursor: "pointer", transition: "all 0.2s"
            }}
          >
            Sign In
          </button>
          <button 
            onClick={() => { setIsLogin(false); setShowOTP(false); setOtpSent(false); }}
            style={{ 
              flex: 1, padding: "14px", background: "none", border: "none",
              borderBottom: `2px solid ${!isLogin ? "var(--clr-primary)" : "transparent"}`,
              color: !isLogin ? "var(--clr-primary)" : "var(--clr-text-3)",
              fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500,
              letterSpacing: "0.1em", cursor: "pointer", transition: "all 0.2s"
            }}
          >
            Create Account
          </button>
        </div>

        {/* OTP / Password Toggle (only for login) */}
        {isLogin && (
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button 
              onClick={() => setShowOTP(false)}
              style={{ 
                flex: 1, padding: "10px", background: !showOTP ? "var(--clr-primary)" : "transparent",
                color: !showOTP ? "var(--clr-bg)" : "var(--clr-text-3)",
                border: `1px solid ${!showOTP ? "var(--clr-primary)" : "var(--clr-border-2)"}`,
                cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "12px",
                transition: "all 0.2s"
              }}
            >
              Password Login
            </button>
            <button 
              onClick={() => setShowOTP(true)}
              style={{ 
                flex: 1, padding: "10px", background: showOTP ? "var(--clr-primary)" : "transparent",
                color: showOTP ? "var(--clr-bg)" : "var(--clr-text-3)",
                border: `1px solid ${showOTP ? "var(--clr-primary)" : "var(--clr-border-2)"}`,
                cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "12px",
                transition: "all 0.2s"
              }}
            >
              OTP Login
            </button>
          </div>
        )}

        {/* PASSWORD LOGIN FORM */}
        {isLogin && !showOTP && (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "8px" }}>
                Email Address
              </label>
              <input 
                type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="priya@example.com" required
                style={{ width: "100%", padding: "14px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none", transition: "border-color 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "var(--clr-primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--clr-border-2)"}
              />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "8px" }}>
                Password
              </label>
              <input 
                type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••" required
                style={{ width: "100%", padding: "14px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none", transition: "border-color 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "var(--clr-primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--clr-border-2)"}
              />
            </div>
            <button 
              type="submit" disabled={loading || authLoading}
              style={{ padding: "15px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", transition: "background 0.3s", opacity: (loading || authLoading) ? 0.7 : 1 }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--clr-primary-light)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--clr-primary)"}
            >
              {loading || authLoading ? "Signing In..." : "Sign In →"}
            </button>
            <p style={{ textAlign: "center", fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>
              <a href="/forgot-password" style={{ color: "var(--clr-primary)", textDecoration: "none" }}>Forgot password?</a>
            </p>
          </form>
        )}

        {/* OTP LOGIN FORM */}
        {isLogin && showOTP && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Method Selection */}
            <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid var(--clr-divider)" }}>
              {[
                { id: "email", label: "📧 Email", icon: "📧" },
                { id: "phone", label: "📱 Phone", icon: "📱" },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => { setOtpMethod(method.id); setOtpSent(false); setOtpCode(""); }}
                  style={{
                    flex: 1, padding: "12px", background: otpMethod === method.id ? "rgba(201,169,110,0.1)" : "transparent",
                    border: "none", borderBottom: `2px solid ${otpMethod === method.id ? "var(--clr-primary)" : "transparent"}`,
                    color: otpMethod === method.id ? "var(--clr-primary)" : "var(--clr-text-3)",
                    fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: otpMethod === method.id ? 600 : 400,
                    cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  {method.label}
                </button>
              ))}
            </div>

            {!otpSent ? (
              <>
                {otpMethod === "email" ? (
                  <div>
                    <label style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "8px" }}>
                      Email Address
                    </label>
                    <input 
                      type="email" value={otpEmail} onChange={(e) => setOtpEmail(e.target.value)}
                      placeholder="priya@example.com"
                      style={{ width: "100%", padding: "14px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none" }}
                      onFocus={(e) => e.target.style.borderColor = "var(--clr-primary)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--clr-border-2)"}
                    />
                  </div>
                ) : (
                  <div>
                    <label style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "8px" }}>
                      Phone Number
                    </label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ padding: "14px 12px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", borderRight: "none", color: "var(--clr-text-3)" }}>+91</span>
                      <input 
                        type="tel" value={otpPhone} onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="9876543210"
                        style={{ flex: 1, padding: "14px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none" }}
                        onFocus={(e) => e.target.style.borderColor = "var(--clr-primary)"}
                        onBlur={(e) => e.target.style.borderColor = "var(--clr-border-2)"}
                      />
                    </div>
                  </div>
                )}
                <button 
                  onClick={handleSendOTP} disabled={loading}
                  style={{ padding: "15px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? "Sending..." : "Send OTP →"}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "8px", textAlign: "center" }}>
                    Enter OTP
                  </label>
                  <input 
                    type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="• • • • • •" maxLength={6}
                    style={{ width: "100%", padding: "14px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-primary)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "24px", textAlign: "center", letterSpacing: "0.3em", outline: "none" }}
                    autoFocus
                  />
                </div>
                <button 
                  onClick={handleVerifyOTP} disabled={loading || otpCode.length !== 6}
                  style={{ padding: "15px", background: otpCode.length === 6 ? "var(--clr-primary)" : "var(--clr-bg-3)", color: otpCode.length === 6 ? "var(--clr-bg)" : "var(--clr-text-muted)", border: "none", cursor: otpCode.length === 6 ? "pointer" : "not-allowed", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}
                >
                  {loading ? "Verifying..." : "Verify & Login →"}
                </button>
                <button 
                  onClick={() => { setOtpSent(false); setOtpCode(""); }}
                  style={{ background: "none", border: "none", color: "var(--clr-text-3)", fontFamily: "var(--font-body)", fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}
                >
                  ← Use different email/phone
                </button>
              </>
            )}
          </div>
        )}

        {/* REGISTRATION FORM */}
        {!isLogin && (
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "8px" }}>
                Full Name *
              </label>
              <input 
                type="text" value={regName} onChange={(e) => setRegName(e.target.value)}
                placeholder="Priya Sharma" required
                style={{ width: "100%", padding: "14px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none" }}
                onFocus={(e) => e.target.style.borderColor = "var(--clr-primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--clr-border-2)"}
              />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "8px" }}>
                Email Address *
              </label>
              <input 
                type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                placeholder="priya@example.com" required
                style={{ width: "100%", padding: "14px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none" }}
                onFocus={(e) => e.target.style.borderColor = "var(--clr-primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--clr-border-2)"}
              />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "8px" }}>
                Phone Number *
              </label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ padding: "14px 12px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", borderRight: "none", color: "var(--clr-text-3)" }}>+91</span>
                <input 
                  type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9876543210" required
                  style={{ flex: 1, padding: "14px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none" }}
                  onFocus={(e) => e.target.style.borderColor = "var(--clr-primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--clr-border-2)"}
                />
              </div>
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "8px" }}>
                Password *
              </label>
              <input 
                type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Min. 6 characters" required
                style={{ width: "100%", padding: "14px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none" }}
                onFocus={(e) => e.target.style.borderColor = "var(--clr-primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--clr-border-2)"}
              />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "8px" }}>
                Confirm Password *
              </label>
              <input 
                type="password" value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="Confirm your password" required
                style={{ width: "100%", padding: "14px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none" }}
                onFocus={(e) => e.target.style.borderColor = "var(--clr-primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--clr-border-2)"}
              />
            </div>
            <button 
              type="submit" disabled={loading || authLoading}
              style={{ padding: "15px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", transition: "background 0.3s", opacity: (loading || authLoading) ? 0.7 : 1 }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--clr-primary-light)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--clr-primary)"}
            >
              {loading || authLoading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>
        )}

        <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", textAlign: "center", marginTop: "24px" }}>
          By continuing, you agree to our <a href="#" style={{ color: "var(--clr-primary)" }}>Terms</a> and <a href="#" style={{ color: "var(--clr-primary)" }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useToast } from "../context/ToastContext";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiClient.put(`/api/auth/reset-password/${token}`, { password });
      
      if (response.data.success) {
        setSuccess(true);
        toast.success("Password reset successfully! Please login with your new password.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "var(--clr-bg)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "40px" 
    }}>
      <div style={{ 
        maxWidth: "450px", 
        width: "100%", 
        background: "var(--clr-bg-2)", 
        border: "1px solid var(--clr-border-2)", 
        padding: "48px" 
      }}>
        
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "32px", 
            fontWeight: 300, 
            letterSpacing: "0.15em", 
            color: "var(--clr-text)" 
          }}>
            SUIIS <span style={{ color: "var(--clr-primary)" }}>Beauty</span>
          </div>
        </div>

        {success ? (
          // Success State
          <>
            <div style={{ fontSize: "48px", textAlign: "center", marginBottom: "20px" }}>✅</div>
            <h2 style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "28px", 
              fontWeight: 300, 
              color: "var(--clr-text)", 
              textAlign: "center", 
              marginBottom: "12px" 
            }}>
              Password Reset Successful!
            </h2>
            <p style={{ 
              fontFamily: "var(--font-body)", 
              fontSize: "14px", 
              color: "var(--clr-text-3)", 
              textAlign: "center", 
              marginBottom: "28px" 
            }}>
              Your password has been reset successfully. You will be redirected to login page.
            </p>
            <Link 
              to="/login" 
              style={{ 
                display: "block", 
                textAlign: "center", 
                padding: "14px", 
                background: "var(--clr-primary)", 
                color: "var(--clr-bg)", 
                textDecoration: "none", 
                fontFamily: "var(--font-body)", 
                fontSize: "11px", 
                fontWeight: 600, 
                letterSpacing: "0.2em", 
                textTransform: "uppercase" 
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--clr-primary-light)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--clr-primary)"}
            >
              Go to Login →
            </Link>
          </>
        ) : (
          // Form State
          <>
            <h2 style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "28px", 
              fontWeight: 300, 
              color: "var(--clr-text)", 
              marginBottom: "8px" 
            }}>
              Create New Password
            </h2>
            <p style={{ 
              fontFamily: "var(--font-body)", 
              fontSize: "13px", 
              color: "var(--clr-text-3)", 
              marginBottom: "32px" 
            }}>
              Enter your new password below to reset your account.
            </p>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* New Password Field */}
              <div>
                <label style={{ 
                  fontFamily: "var(--font-body)", 
                  fontSize: "11px", 
                  fontWeight: 500, 
                  letterSpacing: "0.15em", 
                  textTransform: "uppercase", 
                  color: "var(--clr-text-3)", 
                  display: "block", 
                  marginBottom: "8px" 
                }}>
                  New Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  style={{ 
                    width: "100%", 
                    padding: "14px 16px", 
                    background: "var(--clr-bg-3)", 
                    border: "1px solid var(--clr-border-2)", 
                    color: "var(--clr-text)", 
                    fontFamily: "var(--font-body)", 
                    fontSize: "14px", 
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--clr-primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--clr-border-2)"}
                />
              </div>
              
              {/* Confirm Password Field */}
              <div>
                <label style={{ 
                  fontFamily: "var(--font-body)", 
                  fontSize: "11px", 
                  fontWeight: 500, 
                  letterSpacing: "0.15em", 
                  textTransform: "uppercase", 
                  color: "var(--clr-text-3)", 
                  display: "block", 
                  marginBottom: "8px" 
                }}>
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  style={{ 
                    width: "100%", 
                    padding: "14px 16px", 
                    background: "var(--clr-bg-3)", 
                    border: "1px solid var(--clr-border-2)", 
                    color: "var(--clr-text)", 
                    fontFamily: "var(--font-body)", 
                    fontSize: "14px", 
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--clr-primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--clr-border-2)"}
                />
              </div>
              
              {/* Password Match Indicator */}
              {password && confirmPassword && password !== confirmPassword && (
                <p style={{ 
                  fontFamily: "var(--font-body)", 
                  fontSize: "12px", 
                  color: "#e87070", 
                  marginTop: "-10px" 
                }}>
                  ⚠ Passwords do not match
                </p>
              )}
              
              {password && confirmPassword && password === confirmPassword && password.length >= 6 && (
                <p style={{ 
                  fontFamily: "var(--font-body)", 
                  fontSize: "12px", 
                  color: "#7ec88a", 
                  marginTop: "-10px" 
                }}>
                  ✓ Passwords match
                </p>
              )}
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !password || !confirmPassword || password !== confirmPassword || password.length < 6}
                style={{ 
                  padding: "15px", 
                  background: (loading || !password || !confirmPassword || password !== confirmPassword || password.length < 6) 
                    ? "var(--clr-bg-3)" 
                    : "var(--clr-primary)", 
                  color: (loading || !password || !confirmPassword || password !== confirmPassword || password.length < 6) 
                    ? "var(--clr-text-muted)" 
                    : "var(--clr-bg)", 
                  border: "none", 
                  cursor: (loading || !password || !confirmPassword || password !== confirmPassword || password.length < 6) 
                    ? "not-allowed" 
                    : "pointer", 
                  fontFamily: "var(--font-body)", 
                  fontSize: "11px", 
                  fontWeight: 600, 
                  letterSpacing: "0.2em", 
                  textTransform: "uppercase", 
                  transition: "background 0.3s",
                  opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading && password && confirmPassword && password === confirmPassword && password.length >= 6) {
                    e.currentTarget.style.background = "var(--clr-primary-light)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && password && confirmPassword && password === confirmPassword && password.length >= 6) {
                    e.currentTarget.style.background = "var(--clr-primary)"
                  }
                }}
              >
                {loading ? "Resetting Password..." : "Reset Password →"}
              </button>
              
              {/* Back to Login Link */}
              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <Link 
                  to="/login" 
                  style={{ 
                    fontFamily: "var(--font-body)", 
                    fontSize: "13px", 
                    color: "var(--clr-text-3)", 
                    textDecoration: "none" 
                  }}
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
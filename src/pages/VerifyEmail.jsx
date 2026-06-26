import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
        
        if (response.data.success) {
          setStatus("success");
          setMessage("Email verified successfully!");
          toast.success("Email verified! You can now login.");
          
          // Store user data
          localStorage.setItem("suiis_user", JSON.stringify(response.data.user));
          localStorage.setItem("suiis_token", response.data.token);
          
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed");
        toast.error("Verification failed. Please try again.");
      }
    };
    
    verifyEmail();
  }, [token, navigate, toast]);

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
        maxWidth: "500px", 
        width: "100%", 
        background: "var(--clr-bg-2)", 
        border: "1px solid var(--clr-border-2)", 
        padding: "48px", 
        textAlign: "center" 
      }}>
        
        {status === "verifying" && (
          <>
            <div className="loader-spinner" style={{ margin: "0 auto 24px" }} />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--clr-text)" }}>
              Verifying Your Email...
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text-3)", marginTop: "12px" }}>
              Please wait while we verify your email address.
            </p>
          </>
        )}
        
        {status === "success" && (
          <>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>✅</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--clr-text)" }}>
              Email Verified!
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text-3)", marginTop: "12px", marginBottom: "28px" }}>
              {message}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-primary)" }}>
              Redirecting to homepage...
            </p>
          </>
        )}
        
        {status === "error" && (
          <>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>❌</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "#e87070" }}>
              Verification Failed
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text-3)", marginTop: "12px", marginBottom: "28px" }}>
              {message}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Link 
                to="/login" 
                style={{ 
                  padding: "12px 24px", 
                  background: "var(--clr-primary)", 
                  color: "var(--clr-bg)", 
                  textDecoration: "none", 
                  fontFamily: "var(--font-body)", 
                  fontSize: "11px", 
                  fontWeight: 600, 
                  letterSpacing: "0.15em", 
                  textTransform: "uppercase" 
                }}
              >
                Go to Login
              </Link>
              <Link 
                to="/register" 
                style={{ 
                  padding: "12px 24px", 
                  background: "transparent", 
                  color: "var(--clr-text-2)", 
                  border: "1px solid var(--clr-border-2)", 
                  textDecoration: "none", 
                  fontFamily: "var(--font-body)", 
                  fontSize: "11px", 
                  letterSpacing: "0.15em", 
                  textTransform: "uppercase" 
                }}
              >
                Sign Up
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
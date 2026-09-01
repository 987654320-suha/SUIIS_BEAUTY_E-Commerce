import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient from "../api/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);

  // Validate session on app initialization
  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.removeItem("suiisUser");
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const { data } = await apiClient.get("/api/auth/profile");
        const authenticatedUser = data.user || data;

        if (isMounted) {
          localStorage.setItem("suiisUser", JSON.stringify(authenticatedUser));
          setUser(authenticatedUser);
        }
      } catch (err) {
        console.warn("[Auth] Session validation failed:", err.response?.data?.message || err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("suiisUser");
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    validateSession();

    // Listen for unauthorized events emitted by apiClient interceptor
    const handleUnauthorized = () => {
      if (isMounted) {
        setUser(null);
        setLoading(false);
      }
    };

    window.addEventListener("suiis:unauthorized", handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener("suiis:unauthorized", handleUnauthorized);
    };
  }, []);

  // Standard email/password login
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const { data } = await apiClient.post("/api/auth/login", { email, password });

      const token = data.token;
      const authenticatedUser = data.user || data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("suiisUser", JSON.stringify(authenticatedUser));
        setUser(authenticatedUser);
      }

      setLoading(false);
      return { success: true, data: authenticatedUser };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed. Please check your credentials.",
      };
    }
  }, []);

  // Standard registration
  const register = useCallback(async (formData) => {
    try {
      setLoading(true);
      const { data } = await apiClient.post("/api/auth/register", formData);

      const token = data.token;
      const authenticatedUser = data.user || data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("suiisUser", JSON.stringify(authenticatedUser));
        setUser(authenticatedUser);
      }

      setLoading(false);
      return { success: true, data: authenticatedUser };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed.",
      };
    }
  }, []);

  // Social login - Google
  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.post("/api/auth/google", { tokenId: "demo_google_token" });

      const token = data.token;
      const authenticatedUser = data.user || data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("suiisUser", JSON.stringify(authenticatedUser));
        setUser(authenticatedUser);
      }

      setLoading(false);
      return { success: true, data: authenticatedUser };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Google login failed.",
      };
    }
  }, []);

  // Social login - Facebook
  const loginWithFacebook = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.post("/api/auth/facebook", { accessToken: "demo_facebook_token" });

      const token = data.token;
      const authenticatedUser = data.user || data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("suiisUser", JSON.stringify(authenticatedUser));
        setUser(authenticatedUser);
      }

      setLoading(false);
      return { success: true, data: authenticatedUser };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Facebook login failed.",
      };
    }
  }, []);

  // Send OTP (Phone or Email)
  const sendOTP = useCallback(async (payload) => {
    try {
      setLoading(true);
      const body = typeof payload === "string" ? { phone: payload } : payload;
      const endpoint = body.email ? "/api/auth/send-otp-email" : "/api/auth/send-otp-phone";
      const { data } = await apiClient.post(endpoint, body);

      setOtpSent(true);
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to send OTP.",
      };
    }
  }, []);

  // Verify OTP and authenticate
  const verifyOTP = useCallback(async (payload) => {
    try {
      setLoading(true);
      const body = typeof payload === "string" 
        ? { phone: "9876543210", otp: payload } 
        : payload;

      const { data } = await apiClient.post("/api/auth/verify-otp-login", body);

      const token = data.token;
      const authenticatedUser = data.user || data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("suiisUser", JSON.stringify(authenticatedUser));
        setUser(authenticatedUser);
      }

      setLoading(false);
      return { success: true, data: authenticatedUser };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Invalid OTP. Use 123456 for demo.",
      };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("suiisUser");
      setUser(null);
      setOtpSent(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      const { data } = await apiClient.put("/api/auth/profile", profileData);
      const updatedUser = data.user || data;
      localStorage.setItem("suiisUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setLoading(false);
      return { success: true, data: updatedUser };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update profile.",
      };
    }
  }, []);

  // Forgot password
  const forgotPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      const { data } = await apiClient.post("/api/auth/forgot-password", { email });
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to process forgot password request.",
      };
    }
  }, []);

  const isAdmin = user?.role === "admin";
  const isSeller = user?.role === "seller" || user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        otpSent,
        login,
        loginWithGoogle,
        loginWithFacebook,
        sendOTP,
        verifyOTP,
        register,
        logout,
        updateProfile,
        forgotPassword,
        isAdmin,
        isSeller,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
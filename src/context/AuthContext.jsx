import axios from "axios";
import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext();

const DEMO_USER = {
  id: "u001", name: "Priya Sharma", email: "priya@email.com",
  phone: "9876543210", avatar: null, role: "customer",
  joinDate: "January 2024", loyaltyTier: "Gold",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {

  const saved =
    localStorage.getItem("suiisUser");

  return saved
    ? JSON.parse(saved)
    : null;

});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

const login = useCallback(async (email, password) => {
  try {

    setLoading(true);

    const { data } = await axios.post(
      "http://localhost:5000/api/users/login",
      {
        email,
        password
      }
    );

    console.log("LOGIN RESPONSE:", data);

    localStorage.setItem(
      "suiisUser",
      JSON.stringify(data)
    );

    setUser(data);

    setLoading(false);

    return { success: true };

  } catch (error) {

    setLoading(false);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Login failed"
    };
  }
}, []);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setUser({ ...DEMO_USER, email: "priya@gmail.com", name: "Priya (Google)" });
    setLoading(false);
    return { success: true };
  }, []);

  const loginWithFacebook = useCallback(async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setUser({ ...DEMO_USER, email: "priya@facebook.com", name: "Priya (Facebook)" });
    setLoading(false);
    return { success: true };
  }, []);

  const sendOTP = useCallback(async (phone) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setOtpSent(true);
    setLoading(false);
    return { success: true };
  }, []);

  const verifyOTP = useCallback(async (otp) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    // Demo: OTP 123456 always works
    if (otp === "123456") {
      setUser({ ...DEMO_USER });
      setLoading(false);
      return { success: true };
    }
    setLoading(false);
    return { success: false, error: "Invalid OTP. Use 123456" };
  }, []);

const register = useCallback(async (data) => {
  try {

    setLoading(true);

    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password
      }
    );

    setLoading(false);

    return {
      success: true,
      data: response.data
    };

  } catch (error) {

    setLoading(false);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Registration failed"
    };
  }
}, []);

const logout = useCallback(() => {

  localStorage.removeItem(
    "suiisUser"
  );

  setUser(null);

  setOtpSent(false);

}, []);

  const updateProfile = useCallback(async (data) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setUser(prev => ({ ...prev, ...data }));
    setLoading(false);
    return { success: true };
  }, []);

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    return { success: true };
  }, []);

  const isAdmin = user?.role === "admin";
  const isSeller = user?.role === "seller" || user?.role === "admin";

  return (
    <AuthContext.Provider value={{
      user, loading, otpSent,
      login, loginWithGoogle, loginWithFacebook,
      sendOTP, verifyOTP,
      register, logout, updateProfile, forgotPassword,
      isAdmin, isSeller,
      isLoggedIn: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
import { sendEmail } from "../utils/sendEmail.js";
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP,
  sendOTPToEmail,
  sendOTPToPhone,
  verifyOTPAndLogin,
  sendLoginOTP,
  verifyLoginOTP,
  googleLogin,
  facebookLogin,
  getCurrentUser,
  updateProfile,
  checkUserExists,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ========== AUTHENTICATION ROUTES ==========
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);

// ========== EMAIL VERIFICATION ROUTES ==========
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

// ========== PASSWORD RESET ROUTES ==========
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// ========== OTP ROUTES ==========
router.post("/send-otp", sendOTP);                    // Unified - email or phone
router.post("/send-otp-email", sendOTPToEmail);       // Explicit email OTP
router.post("/send-otp-phone", sendOTPToPhone);       // Explicit phone OTP
router.post("/verify-otp-login", verifyOTPAndLogin);  // Unified verification & login
router.post("/send-login-otp", sendLoginOTP);         // Legacy
router.post("/verify-login-otp", verifyLoginOTP);     // Legacy

// ========== SOCIAL LOGIN ROUTES ==========
router.post("/google", googleLogin);
router.post("/facebook", facebookLogin);

// ========== USER MANAGEMENT ROUTES ==========
router.get("/check-user", checkUserExists);

// ========== PROTECTED ROUTES ==========
router.get("/profile", protect, getCurrentUser);
router.put("/profile", protect, updateProfile);

router.get("/test-email", async (req, res) => {
  try {
    const result = await sendEmail(
      "shindesuhani1812@gmail.com",
      "SUIIS Test Email",
      `
      <h1>🎉 SUIIS Email Test</h1>
      <p>If you received this email, Resend is working correctly.</p>
      `
    );

    console.log(result);

    res.json({
      success: true,
      result,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error,
    });
  }
});
export default router;
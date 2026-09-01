import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id || user.id, 
      email: user.email, 
      role: user.role || "customer" 
    },
    process.env.JWT_SECRET || 'suiis_secret_key',
    { expiresIn: '30d' }
  );
};

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { localUsersStore, initLocalStore } from '../utils/localUserStore.js';

// ========== AUTHENTICATION ==========

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  console.log("🚀 [Auth Register] Request received");

  try {
    const { name, email, password, phone } = req.body;
    console.log(`[Auth Register] Received registration for email: ${email ? email.trim() : "none"}`);

    // Validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, password, phone"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const userExists = await User.findOne({ email: normalizedEmail }).catch(() => null);
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email"
        });
      }

      const phoneExists = await User.findOne({ phone }).catch(() => null);
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Phone number already registered"
        });
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        phone,
        isEmailVerified: false,
        role: "customer",
        loyaltyTier: "Silver",
        loyaltyPoints: 0,
        isActive: true,
        preferences: {
          newsletter: false,
          sms: false,
          push: false
        }
      });

      const verificationToken = user.generateEmailVerificationToken();
      await user.save();

      const token = generateToken(user);
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        loyaltyTier: user.loyaltyTier,
        loyaltyPoints: user.loyaltyPoints,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      localUsersStore.set(normalizedEmail, user);

      return res.status(201).json({
        success: true,
        message: "Registration successful. Please verify your email.",
        token: token,
        user: userResponse,
        ...userResponse
      });
    } else {
      // Local fallback registration
      await initLocalStore();
      const existing = localUsersStore.get(normalizedEmail);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        _id: `u_${Date.now()}`,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        role: "customer",
        loyaltyTier: "Silver",
        loyaltyPoints: 0,
        isEmailVerified: true,
        isActive: true,
        preferences: { newsletter: false, sms: false, push: false },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      localUsersStore.set(normalizedEmail, newUser);
      const token = generateToken(newUser);

      const userResponse = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
        loyaltyTier: newUser.loyaltyTier,
        loyaltyPoints: newUser.loyaltyPoints,
        avatar: null,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      };

      return res.status(201).json({
        success: true,
        message: "Registration successful.",
        token: token,
        user: userResponse,
        ...userResponse
      });
    }

  } catch (err) {
    console.error("[Auth Register] ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Registration failed",
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  console.log("🚀 [Auth Login] Request received");

  try {
    const { email, password } = req.body;
    console.log(`[Auth Login] Email received: ${email ? email.trim() : "none"}`);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = null;
    let isPasswordValid = false;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        console.log("[Auth Login] Querying database for user...");
        user = await User.findOne({ email: normalizedEmail });
        console.log(`[Auth Login] Database lookup: ${user ? "User found" : "User not found"}`);
      } catch (dbErr) {
        console.warn("[Auth Login] DB lookup warning:", dbErr.message);
      }
    }

    // Check local store fallback if DB is offline or user not in DB
    if (!user) {
      await initLocalStore();
      user = localUsersStore.get(normalizedEmail);
      if (user) {
        console.log("[Auth Login] User located in local registry");
      }
    }

    if (!user) {
      console.log("[Auth Login] Authentication failed: user not found");
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Please contact support."
      });
    }

    // Password comparison
    console.log("[Auth Login] Comparing password...");
    if (typeof user.matchPassword === "function") {
      isPasswordValid = await user.matchPassword(password);
    } else if (user.password) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    }

    console.log(`[Auth Login] Password match result: ${isPasswordValid ? "MATCH" : "MISMATCH"}`);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (isDbConnected && typeof user.save === "function") {
      user.lastLogin = new Date();
      await user.save().catch(() => {});
    }

    console.log("[Auth Login] Generating JWT...");
    const token = generateToken(user);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role || "customer",
      isEmailVerified: user.isEmailVerified ?? true,
      loyaltyTier: user.loyaltyTier || "Silver",
      loyaltyPoints: user.loyaltyPoints || 0,
      avatar: user.avatar || null,
      preferences: user.preferences || {},
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    console.log("[Auth Login] Login success, returning HTTP 200");
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: userResponse,
      ...userResponse
    });

  } catch (err) {
    console.error("[Auth Login] ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Login failed",
    });
  }
};

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
export const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Logout failed"
    });
  }
};

// ========== EMAIL VERIFICATION ==========

// @desc    Verify email
// @route   GET /api/users/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token"
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (err) {
    console.error("VERIFY EMAIL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Email verification failed"
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/users/resend-verification
// @access  Public
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified"
      });
    }

    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // TODO: Send email with verification token
    console.log(`Verification token for ${email}: ${verificationToken}`);

    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully"
    });

  } catch (err) {
    console.error("RESEND VERIFICATION ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to resend verification"
    });
  }
};

// ========== PASSWORD RESET ==========

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email"
      });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // TODO: Send reset email
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to email"
    });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to process request"
    });
  }
};

// @desc    Reset password
// @route   PUT /api/users/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful"
    });

  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to reset password"
    });
  }
};

// ========== OTP FUNCTIONS ==========

// @desc    Send OTP
// @route   POST /api/users/send-otp
// @access  Public
export const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP for ${phone}: ${otp}`);

    // Store OTP in user document or separate collection
    // For demo, we'll just log it

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp: otp // Remove in production
    });

  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to send OTP"
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required"
      });
    }

    // For demo: accept 123456
    if (otp === "123456") {
      const user = await User.findOne({ phone });
      
      if (user) {
        // You can add phone verification field if needed
        // user.phoneVerified = true;
        // await user.save();
        
        const token = generateToken(user);
        return res.status(200).json({
          success: true,
          message: "OTP verified successfully",
          token: token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            loyaltyTier: user.loyaltyTier,
            loyaltyPoints: user.loyaltyPoints
          }
        });
      }

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully"
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid OTP. Please use 123456 for testing."
    });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "OTP verification failed"
    });
  }
};

// @desc    Send OTP to email
// @route   POST /api/users/send-otp-email
// @access  Public
export const sendOTPToEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Email OTP for ${email}: ${otp}`);

    // TODO: Send email with OTP
    // await sendEmailOTP(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
      otp: otp // Remove in production
    });

  } catch (err) {
    console.error("SEND OTP EMAIL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to send OTP"
    });
  }
};

// @desc    Send OTP to phone
// @route   POST /api/users/send-otp-phone
// @access  Public
export const sendOTPToPhone = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Phone OTP for ${phone}: ${otp}`);

    // TODO: Send SMS with OTP
    // await sendSMSOTP(phone, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to phone",
      otp: otp // Remove in production
    });

  } catch (err) {
    console.error("SEND OTP PHONE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to send OTP"
    });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/users/verify-otp-login
// @access  Public
export const verifyOTPAndLogin = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required"
      });
    }

    if (otp === "123456") {
      const user = await User.findOne({ phone });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found with this phone number"
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Your account has been deactivated"
        });
      }

      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: token,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        loyaltyTier: user.loyaltyTier,
        loyaltyPoints: user.loyaltyPoints,
        avatar: user.avatar
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid OTP"
    });

  } catch (err) {
    console.error("VERIFY OTP LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "OTP verification failed"
    });
  }
};

// @desc    Send login OTP (legacy)
// @route   POST /api/users/send-login-otp
// @access  Public
export const sendLoginOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Login OTP for ${phone}: ${otp}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp: otp // Remove in production
    });

  } catch (err) {
    console.error("SEND LOGIN OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to send OTP"
    });
  }
};

// @desc    Verify login OTP (legacy)
// @route   POST /api/users/verify-login-otp
// @access  Public
export const verifyLoginOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required"
      });
    }

    if (otp === "123456") {
      const user = await User.findOne({ phone });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const token = generateToken(user);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: token,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid OTP"
    });

  } catch (err) {
    console.error("VERIFY LOGIN OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "OTP verification failed"
    });
  }
};

// ========== SOCIAL LOGIN ==========

// @desc    Google Login
// @route   POST /api/users/google
// @access  Public
export const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({
        success: false,
        message: "Google token is required"
      });
    }

    // TODO: Verify Google token and get user info
    // For demo, return mock user or find existing user
    
    // Check if user exists with Google email
    // const user = await User.findOne({ email: googleUser.email });
    // if (user) { ... }

    // For demo, return mock user
    const mockUser = {
      _id: "google_" + Date.now(),
      name: "Google User",
      email: "google@user.com",
      role: "customer",
      isEmailVerified: true
    };

    const token = generateToken(mockUser);

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token: token,
      user: mockUser
    });

  } catch (err) {
    console.error("GOOGLE LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Google login failed"
    });
  }
};

// @desc    Facebook Login
// @route   POST /api/users/facebook
// @access  Public
export const facebookLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Facebook token is required"
      });
    }

    // TODO: Verify Facebook token and get user info
    // For demo, return mock user
    const mockUser = {
      _id: "fb_" + Date.now(),
      name: "Facebook User",
      email: "facebook@user.com",
      role: "customer",
      isEmailVerified: true
    };

    const token = generateToken(mockUser);

    return res.status(200).json({
      success: true,
      message: "Facebook login successful",
      token: token,
      user: mockUser
    });

  } catch (err) {
    console.error("FACEBOOK LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Facebook login failed"
    });
  }
};

// ========== PROFILE MANAGEMENT ==========

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    let user = null;

    if (userId) {
      try {
        user = await User.findById(userId).select('-password');
      } catch (dbErr) {
        console.warn("DB user lookup warning in getCurrentUser:", dbErr.message);
      }
    }

    if (!user && req.user) {
      user = req.user;
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    const userData = {
      _id: user._id || user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role || "customer",
      isEmailVerified: user.isEmailVerified ?? true,
      loyaltyTier: user.loyaltyTier || "Silver",
      loyaltyPoints: user.loyaltyPoints || 0,
      avatar: user.avatar || null,
      preferences: user.preferences || {},
      isActive: user.isActive ?? true,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return res.status(200).json({
      success: true,
      user: userData,
      ...userData
    });

  } catch (err) {
    console.error("GET USER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to get user"
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar, preferences } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences
      };
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      preferences: user.preferences,
      loyaltyTier: user.loyaltyTier,
      loyaltyPoints: user.loyaltyPoints
    });

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update profile"
    });
  }
};

// @desc    Check if user exists
// @route   GET /api/users/check-user
// @access  Public
export const checkUserExists = async (req, res) => {
  try {
    const { email, phone } = req.query;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Email or phone is required"
      });
    }

    const query = {};
    if (email) query.email = email;
    if (phone) query.phone = phone;

    const user = await User.findOne(query).select('name email phone role isActive isEmailVerified');
    
    return res.status(200).json({
      success: true,
      exists: !!user,
      user: user ? {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified
      } : null
    });

  } catch (err) {
    console.error("CHECK USER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to check user"
    });
  }
};
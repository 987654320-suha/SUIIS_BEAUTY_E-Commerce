import jwt from "jsonwebtoken";
import User from "../models/User.js";

import mongoose from "mongoose";
import { localUsersStore, initLocalStore } from "../utils/localUserStore.js";

// ─── Core auth guard ─────────────────────────────────────────────────────────
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized — no token provided." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "suiis_secret_key"
    );

    let user = null;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && decoded.id && mongoose.Types.ObjectId.isValid(decoded.id)) {
      try {
        user = await User.findById(decoded.id).select("-password");
      } catch (e) {
        // Fallback to local store
      }
    }

    if (!user) {
      await initLocalStore();
      user = [...localUsersStore.values()].find(
        (u) => u._id === decoded.id || u.email === decoded.email
      );
    }

    if (!user) {
      user = {
        _id: decoded.id,
        name: decoded.email ? decoded.email.split("@")[0] : "User",
        email: decoded.email || "user@suiis.com",
        role: decoded.role || "customer",
      };
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Session expired. Please log in again." });
    }
    return res
      .status(401)
      .json({ success: false, message: "Invalid token. Please log in again." });
  }
};

// ─── Admin-only guard ─────────────────────────────────────────────────────────
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied — Admin privileges required.",
  });
};

// ─── Seller guard (sellers + admins) ─────────────────────────────────────────
export const seller = (req, res, next) => {
  if (req.user && (req.user.role === "seller" || req.user.role === "admin")) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied — Seller privileges required.",
  });
};

// ─── Optional auth (attaches user if token present, does NOT block if absent) ─
export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(); // anonymous request — continue normally

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "suiis_secret_key");
    if (decoded.id && typeof decoded.id === "string" && (decoded.id.startsWith("google_") || decoded.id.startsWith("fb_"))) {
      req.user = {
        _id: decoded.id,
        name: decoded.email ? decoded.email.split("@")[0] : "Social User",
        email: decoded.email || "user@suiis.com",
        role: decoded.role || "customer",
      };
    } else {
      req.user = await User.findById(decoded.id).select("-password");
    }
  } catch {
    // Invalid/expired token on optional route — just ignore it
  }

  next();
};
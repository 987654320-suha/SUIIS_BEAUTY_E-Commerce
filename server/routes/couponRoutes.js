import express from "express";
import {
  validateCoupon,
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/validate/:code", validateCoupon);

// Admin only routes
router.route("/").get(protect, admin, getAllCoupons).post(protect, admin, createCoupon);
router.route("/:couponId").put(protect, admin, updateCoupon).delete(protect, admin, deleteCoupon);

export default router;
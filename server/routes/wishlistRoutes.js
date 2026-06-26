import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getWishlist).post(protect, addToWishlist);
router.route("/:productId").delete(protect, removeFromWishlist);
router.route("/move-to-cart/:productId").post(protect, moveToCart);

export default router;
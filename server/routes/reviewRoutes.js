import express from "express";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  reportReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.post("/:productId", protect, createReview);
router.put("/:reviewId", protect, updateReview);
router.delete("/:reviewId", protect, deleteReview);
router.post("/:reviewId/like", protect, likeReview);
router.post("/:reviewId/report", protect, reportReview);

export default router;
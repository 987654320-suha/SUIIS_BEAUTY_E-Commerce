import mongoose from "mongoose";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Get product reviews
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = "latest" } = req.query;
    
    let sortOption = {};
    switch (sort) {
      case "latest":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "highest":
        sortOption = { rating: -1 };
        break;
      case "lowest":
        sortOption = { rating: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const totalReviews = await Review.countDocuments({ product: productId });
    
    res.json({
      success: true,
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalReviews,
        pages: Math.ceil(totalReviews / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a review
export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment, images } = req.body;
    
    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      "orderItems.product": productId,
      status: "Delivered",
    });
    
    if (!hasPurchased) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only review products you've purchased" 
      });
    }
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      user: req.user._id, 
      product: productId 
    });
    
    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: "You have already reviewed this product" 
      });
    }
    
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      title,
      comment,
      images: images || [],
      isVerifiedPurchase: true,
    });
    
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment, images } = req.body;
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    
    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.images = images || review.images;
    
    await review.save();
    
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    
    await review.deleteOne();
    
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like a review
export const likeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    
    const hasLiked = review.likes.includes(req.user._id);
    
    if (hasLiked) {
      review.likes = review.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      review.likes.push(req.user._id);
    }
    
    await review.save();
    
    res.json({ success: true, likes: review.likes.length, hasLiked: !hasLiked });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Report a review
export const reportReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    
    const alreadyReported = review.reports.some(r => r.user.toString() === req.user._id.toString());
    
    if (alreadyReported) {
      return res.status(400).json({ success: false, message: "You already reported this review" });
    }
    
    review.reports.push({
      user: req.user._id,
      reason,
      reportedAt: new Date(),
    });
    
    await review.save();
    
    res.json({ success: true, message: "Review reported" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
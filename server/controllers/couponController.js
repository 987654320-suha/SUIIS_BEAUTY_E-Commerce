import Coupon from "../models/Coupon.js";

// Validate and apply coupon
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.params;
    const { cartTotal } = req.query;
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });
    
    if (!coupon) {
      return res.status(404).json({ 
        success: false, 
        message: "Invalid or expired coupon code" 
      });
    }
    
    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ 
        success: false, 
        message: "Coupon usage limit exceeded" 
      });
    }
    
    // Check minimum order
    if (cartTotal && coupon.minOrder > parseFloat(cartTotal)) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum order amount of ₹${coupon.minOrder} required` 
      });
    }
    
    let discount = 0;
    if (coupon.type === "percentage") {
      discount = (parseFloat(cartTotal) * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else if (coupon.type === "fixed") {
      discount = coupon.value;
    }
    
    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount: Math.round(discount),
        description: coupon.description,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create coupon (admin)
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all coupons (admin)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update coupon (admin)
export const updateCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const coupon = await Coupon.findByIdAndUpdate(couponId, req.body, { new: true });
    
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    
    res.json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete coupon (admin)
export const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const coupon = await Coupon.findByIdAndDelete(couponId);
    
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    
    res.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
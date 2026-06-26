import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// Get user wishlist
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("items.product");
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }
    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }

    const alreadyExists = wishlist.items.some(item => item.product.toString() === productId);
    
    if (alreadyExists) {
      return res.status(400).json({ success: false, message: "Product already in wishlist" });
    }

    wishlist.items.push({ product: productId });
    await wishlist.save();
    
    res.status(201).json({ success: true, message: "Product added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(item => item.product.toString() !== req.params.productId);
    await wishlist.save();
    
    res.json({ success: true, message: "Product removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Move wishlist item to cart
export const moveToCart = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    const itemToMove = wishlist.items.find(item => item.product.toString() === req.params.productId);
    
    if (!itemToMove) {
      return res.status(404).json({ success: false, message: "Item not found in wishlist" });
    }

    // Remove from wishlist
    wishlist.items = wishlist.items.filter(item => item.product.toString() !== req.params.productId);
    await wishlist.save();
    
    res.json({ success: true, message: "Item moved to cart", wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
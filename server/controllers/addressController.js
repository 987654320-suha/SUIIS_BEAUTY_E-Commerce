import Address from "../models/Address.js";

// Get user addresses
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create address
export const createAddress = async (req, res) => {
  try {
    const address = await Address.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findOneAndUpdate(
      { _id: addressId, user: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    
    res.json({ success: true, address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findOneAndDelete({ _id: addressId, user: req.user._id });
    
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    
    res.json({ success: true, message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    
    // Remove default from all addresses
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
    
    // Set new default
    const address = await Address.findOneAndUpdate(
      { _id: addressId, user: req.user._id },
      { isDefault: true },
      { new: true }
    );
    
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    
    res.json({ success: true, address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
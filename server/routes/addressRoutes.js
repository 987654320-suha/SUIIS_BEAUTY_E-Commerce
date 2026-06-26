import express from "express";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getAddresses).post(protect, createAddress);
router.route("/:addressId").put(protect, updateAddress).delete(protect, deleteAddress);
router.route("/:addressId/default").put(protect, setDefaultAddress);

export default router;
import express from "express";
import upload, { handleUploadError } from "../middleware/uploadMiddleware.js";
import { analyzeSkin, handleVoiceConsultation, saveVoicePreferences } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/analyze",
  protect,
  upload.single("image"),
  handleUploadError,
  analyzeSkin
);

router.post("/voice-consultation", protect, handleVoiceConsultation);
router.post("/save-preferences", protect, saveVoicePreferences);

export default router;
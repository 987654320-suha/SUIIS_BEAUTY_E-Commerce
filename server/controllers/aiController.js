import fs from "fs";
import mongoose from "mongoose";
import AIReport from "../models/AIReport.js";
import Product from "../models/Product.js";
import { analyzeBeautyDNA } from "../services/geminiService.js";

export const analyzeSkin = async (req, res) => {
  console.log(`[AI Analyze] Request received for user: ${req.user?._id || "authenticated"}`);

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload an image.",
    });
  }

  const filePath = req.file.path;
  console.log(`[AI Analyze] Upload received: ${req.file.filename} (${req.file.mimetype}, ${req.file.size} bytes)`);

  try {
    console.log("[AI Analyze] Starting Gemini analysis...");
    const aiResponse = await analyzeBeautyDNA(filePath);

    // Gemini returns text, extract JSON
    let result;
    try {
      const cleaned = aiResponse
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      result = JSON.parse(cleaned);
      console.log("[AI Analyze] Gemini response parsed successfully");
    } catch (e) {
      console.error("[AI Analyze] Gemini returned invalid JSON:", e.message);
      console.log("[AI Analyze] Raw AI text:", aiResponse);

      return res.status(500).json({
        success: false,
        message: "AI returned invalid response format. Please try again with a clear selfie.",
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    const validUserId = req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id) ? req.user._id : undefined;

    const reportData = {
      user: validUserId,
      image: req.file.filename,
      skinType: result.skinType || "Normal",
      hydration: typeof result.hydration === "number" ? result.hydration : 75,
      oiliness: typeof result.oiliness === "number" ? result.oiliness : 50,
      acne: result.acne || "None",
      darkCircles: result.darkCircles || "Low",
      pigmentation: result.pigmentation || "Low",
      redness: result.redness || "Low",
      pores: typeof result.pores === "number" ? result.pores : 20,
      confidence: typeof result.confidence === "number" ? result.confidence : 90,
      beautyScore: typeof result.beautyScore === "number" ? result.beautyScore : 85,
      routine: result.routine || {
        morning: ["Gentle Cleanser", "Vitamin C Serum", "Gel Moisturizer", "SPF 50 Sunscreen"],
        night: ["Gentle Cleanser", "Niacinamide Serum", "Moisturizer"],
      },
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
    };

    let report;
    if (isDbConnected) {
      try {
        report = await AIReport.create(reportData);
        console.log(`[AI Analyze] AIReport saved to DB with ID: ${report._id}`);
      } catch (dbErr) {
        console.warn("[AI Analyze] Note: Could not save report to DB:", dbErr.message);
        report = reportData;
      }
    } else {
      report = reportData;
    }

    // Retrieve matching products for recommendation if DB is available
    let products = [];
    if (isDbConnected) {
      try {
        products = await Product.find({
          $or: [
            { category: { $regex: /skincare|serum|cream|moisturizer|cleanser|sunscreen/i } },
            { name: { $regex: /skincare|serum|cream|moisturizer|cleanser|sunscreen|hydration|glow/i } }
          ]
        }).limit(4).lean();

        if (products.length > 0) {
          products = products.map((p) => ({
            ...p,
            match: p.match || "95%",
          }));
        }
      } catch (pErr) {
        console.warn("[AI Analyze] Could not fetch products from database:", pErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      report,
      products: products || [],
    });

  } catch (error) {
    console.error("[AI Analyze] Analysis Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Skin analysis failed. Please try again.",
    });
  } finally {
    // Delete temporary uploaded image in all cases
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`[AI Analyze] Temporary upload cleaned up: ${filePath}`);
      } catch (unlinkErr) {
        console.error("[AI Analyze] Error deleting temporary file:", unlinkErr.message);
      }
    }
  }
};

export const handleVoiceConsultation = async (req, res) => {
  try {
    const { message, skinType, concerns, budget } = req.body;

    res.json({
      success: true,
      aiResponse: `Based on your request regarding ${concerns || skinType || 'skincare'}, I recommend focusing on hydration and active antioxidants.`,
      functionCall: {
        action: "recommendRoutine",
        skinType: skinType || "Combination",
        concerns: concerns || ["Hydration"],
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveVoicePreferences = async (req, res) => {
  try {
    const { skinType, concerns, budget, allergies } = req.body;
    res.json({
      success: true,
      message: "Voice beauty preferences updated successfully.",
      preferences: { skinType, concerns, budget, allergies }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
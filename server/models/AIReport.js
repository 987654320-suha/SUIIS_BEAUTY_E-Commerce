import mongoose from "mongoose";

const aiReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    image: {
      type: String,
      required: true,
    },

    skinType: { type: String, default: "Normal" },
    hydration: { type: Number, default: 75 },
    oiliness: { type: Number, default: 50 },
    acne: { type: String, default: "None" },
    darkCircles: { type: String, default: "Low" },
    pigmentation: { type: String, default: "Low" },
    redness: { type: String, default: "Low" },
    pores: { type: Number, default: 20 },
    confidence: { type: Number, default: 90 },
    beautyScore: { type: Number, default: 85 },

    routine: {
      morning: [{ type: String }],
      night: [{ type: String }],
    },

    recommendations: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AIReport", aiReportSchema);
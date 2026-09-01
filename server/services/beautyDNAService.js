export const analyzeBeautyDNA = async (imagePath) => {
  console.log("Analyzing:", imagePath);

  return {
    skinType: "Combination",
    hydration: 78,
    oiliness: 41,
    acne: "Mild",
    darkCircles: "Low",
    pigmentation: "Low",
    confidence: 97,
  };
};
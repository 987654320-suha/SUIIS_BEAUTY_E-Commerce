import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";

export async function analyzeBeautyDNA(imagePath) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const ext = path.extname(imagePath).toLowerCase();
  let mimeType = "image/jpeg";
  if (ext === ".png") mimeType = "image/png";
  else if (ext === ".webp") mimeType = "image/webp";

  const image = fs.readFileSync(imagePath);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        inlineData: {
          mimeType,
          data: image.toString("base64"),
        },
      },

      {
        text: `
You are an expert AI skincare specialist.

Analyze ONLY visible skin characteristics.

Never diagnose diseases.

Return ONLY valid JSON.

{
"skinType":"",
"hydration":0,
"oiliness":0,
"acne":"",
"pigmentation":"",
"darkCircles":"",
"redness":"",
"pores":"",
"confidence":0,
"beautyScore":0,
"routine":{
"morning":[],
"night":[]
},
"recommendations":[]
}
`
      }

    ]

  });

  return response.text;
}
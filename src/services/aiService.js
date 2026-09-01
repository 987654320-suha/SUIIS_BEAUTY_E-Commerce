import apiClient from "../api/apiClient";

export const analyzeBeautyDNA = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  // NOTE: Do not manually set "Content-Type": "multipart/form-data".
  // Axios and the browser will automatically compute the correct boundary.
  const { data } = await apiClient.post("/api/ai/analyze", formData);
  return data;
};
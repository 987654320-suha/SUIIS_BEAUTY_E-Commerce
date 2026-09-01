import apiClient from "./apiClient";

export const getProducts = async () => {
  const response = await apiClient.get("/api/products");
  return response.data;
};
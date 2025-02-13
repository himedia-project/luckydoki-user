import axiosInstance from "./axiosInstance";

export const getProducts = () => {
  return axiosInstance.get("/api/products");
};

export const getProductById = (productId) => {
  return axiosInstance.get(`/api/product/${productId}`);
};

export const updateProduct = (productId, updateData) => {
  return axiosInstance.put(`/api/product/${productId}`, updateData);
};

export const deleteProduct = (productId) => {
  return axiosInstance.delete(`/api/product/${productId}`);
};

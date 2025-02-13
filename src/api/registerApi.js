import axiosInstance from "./axiosInstance";

// 상품 등록
export const createProduct = (productData) => {
  return axiosInstance.post("/api/product", productData);
};

import axiosInstance from "./axiosInstance";

// 상품 정보 가져오기(detail)
export const getProductInfo = async (productId) => {
  return await axiosInstance.get(`/product/${productId}/detail`);
};

// 상품 장바구니에 담기
export const postProduct = async (formData) => {
  return await axiosInstance.post(`/cart`, formData);
};

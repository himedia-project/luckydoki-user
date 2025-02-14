import axiosInstance from "./axiosInstance";

// 상품 등록
export const createProduct = async (productData) => {
  return await axiosInstance.post("/seller/product", productData);
};

// 셀러 신청
export const upgradeToSeller = async (sellerData) => {
  return await axiosInstance.post("/member/upgrade-to-seller", sellerData);
};

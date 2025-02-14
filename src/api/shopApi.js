import axiosInstance from "./axiosInstance";

// 샵 유저 정보 가져오기
export const getSellerInfo = async (shopId) => {
  return await axiosInstance.get(`/shop/${shopId}`);
};

// 샵 상품 리스트 가져오기
export const getShopProducts = async (shopId) => {
  return await axiosInstance.get(`/shop/${shopId}/product/list`);
};

// 샵 커뮤니티 리스트 가져오기
export const getCommunityPosts = async (shopId) => {
  return await axiosInstance.get(`/shop/${shopId}/community/list`);
};

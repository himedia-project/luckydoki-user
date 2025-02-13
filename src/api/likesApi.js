import axiosInstance from "./axiosInstance";

// 찜한 샵 목록 조회
export const getLikedShops = () => {
  return axiosInstance.get("/api/likes/shop/list");
};

// 찜한 상품 목록 조회
export const getLikedProducts = () => {
  return axiosInstance.get("/api/likes/product/list");
};

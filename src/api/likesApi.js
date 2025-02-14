import axiosInstance from "./axiosInstance";

// 상품 찜 추가/삭제
export const likeProduct = async (productId) => {
  return await axiosInstance.post("/api/likes/product", { productId });
};

// 샵 찜 추가/삭제
export const likeShop = async (shopId) => {
  return await axiosInstance.post("/api/likes/shop", { shopId });
};

// 찜한 샵 목록 조회
export const getLikedShops = async () => {
  return await axiosInstance.get("/api/likes/shop/list");
};

// 찜한 상품 목록 조회
export const getLikedProducts = async () => {
  return await axiosInstance.get("/api/likes/product/list");
};

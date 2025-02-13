import axios from "axios";
import axiosInstance from "./axiosInstance";

export const likeProduct = (productId) => {
  return axiosInstance.post("/api/likes/product", { productId });
};

export const likeShop = (shopId) => {
  return axiosInstance.post("/api/likes/shop", { shopId });
};

// 찜한 샵 목록 조회
export const getLikedShops = () => {
  return axiosInstance.get("/api/likes/shop/list");
};

// 찜한 상품 목록 조회
export const getLikedProducts = () => {
  return axiosInstance.get("/api/likes/product/list");
};

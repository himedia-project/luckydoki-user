import axiosInstance from "./axiosInstance";

// 유저 리뷰 리스트 가져오기
export const getReviewByMember = async () => {
  return await axiosInstance.get("/review/member/list");
};

// 상품 리뷰 리스트 가져오기
export const getReviewByProduct = async (productId) => {
  return await axiosInstance.get(`/review/list/${productId}`);
};

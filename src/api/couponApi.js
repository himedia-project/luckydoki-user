import axiosInstance from "./axiosInstance";

// 쿠폰 정보 가져오기
export const getCoupons = async () => {
  return await axiosInstance.get("/member/coupon/list");
};

import axiosInstance from "./axiosInstance";

// 쿠폰 정보 가져오기
export const getCoupons = async () => {
  return await axiosInstance.get("/member/coupon/list");
};

// 쿠폰 등록
// http://localhost:8080/api/coupon/register
export const registerCoupon = async (code) => {
  return await axiosInstance.post("/coupon/register", { code });
};

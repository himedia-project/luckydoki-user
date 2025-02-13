import axiosInstance from "./axiosInstance";

// 내 정보 가져오기
export const getMyProfile = () => {
  return axiosInstance.get("/api/member/me");
};

// 내 정보 수정
export const updateMyProfile = (updateData) => {
  return axiosInstance.put("api/member/me", updateData);
};

// 셀러 신청
export const upgradeToSeller = (sellerData) => {
  return axiosInstance.post("api/member/upgrade-to-seller", sellerData);
};

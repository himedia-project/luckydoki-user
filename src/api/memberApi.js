import axiosInstance from "./axiosInstance";

// 내 정보 가져오기
export const getMyProfile = async () => {
  return await axiosInstance.get("/api/member/me");
};

// 내 정보 수정
export const updateMyProfile = async (updateData) => {
  return await axiosInstance.put("api/member/me", updateData);
};

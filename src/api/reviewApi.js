import axiosInstance from "./axiosInstance";

export const getReviewByMember = async () => {
  return await axiosInstance.get("/api/review/member/list");
};

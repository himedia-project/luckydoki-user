import axiosInstance from "./axiosInstance";

export const getReviewByMember = () => {
  return axiosInstance.get("/api/review/member");
};

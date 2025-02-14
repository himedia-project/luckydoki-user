import axiosInstance from "./axiosInstance";

// 포스트 등록
export const createPost = async (formData) => {
  return await axiosInstance.post(`/community`, formData);
};

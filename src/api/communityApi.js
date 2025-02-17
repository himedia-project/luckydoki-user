import axiosInstance from "./axiosInstance";

// 포스트 등록
export const createPost = async (formData) => {
  return await axiosInstance.post(`/community`, formData);
};

// 커뮤니티 글 정보 가져오기(detail)
export const getPostInfo = async (id) => {
  return await axiosInstance.get(`/community/detail/${id}`);
};

import axiosInstance from "./axiosInstance";

// 커뮤니티 댓글 가져오기
export const getComments = async (id) => {
  return await axiosInstance.get(`/community/comment/${id}`);
};

// 커뮤니티 댓글 삭제하기
export const deleteComment = async (id) => {
  return await axiosInstance.delete(`/community/comment/${id}`);
};

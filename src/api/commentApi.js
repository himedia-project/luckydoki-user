import axiosInstance from "./axiosInstance";

// 커뮤니티 댓글 가져오기
export const getComments = async (id) => {
  return await axiosInstance.get(`/community/${id}/comment/list`);
};

// 커뮤니티 댓글 삭제하기
export const deleteComment = async (communityId, commentId) => {
  return await axiosInstance.delete(
    `/community/${communityId}/comment/${commentId}`
  );
};

// 커뮤니티 댓글 작성하기
export const postComment = async (id, content) => {
  return await axiosInstance.post(`/community/${id}/comment`, content);
};

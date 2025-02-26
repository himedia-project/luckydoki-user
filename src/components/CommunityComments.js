import React, { useState, useEffect } from "react";
import { getComments, deleteComment, postComment } from "../api/commentApi";
import styles from "../styles/CommunityComments.module.css";
import ImageLoader from "./card/ImageLoader";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function CommunityComments({ postId }) {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userNickName = useSelector((state) => state.loginSlice.nickName);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await getComments(postId);
      setComments(response.data || []);
    } catch (error) {
      console.error("댓글 조회 실패:", error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(postId, commentId);
      fetchComments();
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "댓글 삭제에 실패했습니다.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 동작 방지

    if (isSubmitting) return; // 이미 제출 중이면 중복 실행 방지
    setIsSubmitting(true);

    if (!userNickName) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "로그인이 필요합니다.",
        showConfirmButton: false,
        timer: 1500,
      });
      setIsSubmitting(false);
      return;
    }

    if (!commentInput.trim()) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "댓글 내용을 입력해 주세요.",
        showConfirmButton: false,
        timer: 1500,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await postComment(postId, { content: commentInput });
      setCommentInput("");
      fetchComments();
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "댓글 등록 중 오류가 발생했습니다.",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isSubmitting) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.commentsContainer}>
      <h4 className={styles.commentTopHeader}>댓글</h4>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="댓글을 입력해 주세요."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className={styles.commentInput}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSubmit} className={styles.submitButton}>
          등록
        </button>
      </div>

      {/* 댓글 목록 영역 */}
      <div className={styles.commentsList}>
        {comments.length === 0 ? (
          <p className={styles.noComments}>등록된 댓글이 없습니다.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <ImageLoader
                  imagePath={comment.profileImage}
                  className={styles.userImage}
                />
                <div className={styles.userInfoBox}>
                  <span className={styles.commentAuthor}>
                    {comment.nickName}
                  </span>
                  <span className={styles.commentDate}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className={styles.commentContent}>{comment.content}</div>
              {userNickName === comment.nickName && (
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(comment.id)}
                >
                  삭제
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommunityComments;

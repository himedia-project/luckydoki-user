import React, { useState } from "react";
import Swal from "sweetalert2";
import { likeProduct, likeShop } from "../api/likesApi";

const LikeButton = ({ initialLikeState, itemId, isShop, className }) => {
  const [isLiked, setIsLiked] = useState(initialLikeState);

  const handleLikeToggle = async () => {
    try {
      const likeApi = isShop ? likeShop : likeProduct;
      const response = await likeApi(itemId);

      if (typeof response.data === "boolean") {
        setIsLiked(response.data);

        Swal.fire({
          toast: true,
          position: "top",
          icon: response.data ? "success" : "info",
          title: response.data
            ? "찜 목록에 추가되었습니다."
            : "찜 목록에서 삭제되었습니다.",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: false,
        });
      }
    } catch (error) {
      console.error("찜 상태 변경 실패:", error);
      Swal.fire({
        toast: true,
        position: "top",
        title: "로그인이 필요합니다.",
        icon: "warning",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: false,
      });
    }
  };

  return (
    <img
      src={isLiked ? "/heart_filled.png" : "/heart.png"}
      alt="찜 아이콘"
      className={`${className} ${isLiked ? "liked" : ""}`}
      onClick={handleLikeToggle}
    />
  );
};

export default LikeButton;

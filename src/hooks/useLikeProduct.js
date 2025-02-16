import { useState } from "react";
import Swal from "sweetalert2";
import { likeProduct } from "../api/likesApi";

const useLikeProduct = (initialLikeState, productId) => {
  const [isLiked, setIsLiked] = useState(initialLikeState);

  const toggleLike = async () => {
    try {
      const response = await likeProduct(productId);
      if (typeof response.data === "boolean") {
        setIsLiked(response.data);

        Swal.fire({
          toast: true,
          position: "top",
          icon: response.data ? "success" : "info",
          title: response.data
            ? "찜목록에 추가되었습니다."
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

  return [isLiked, toggleLike];
};

export default useLikeProduct;

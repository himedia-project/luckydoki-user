import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { likeProduct, likeShop } from "../../api/likesApi";
import { useSelector } from "react-redux";

export default function LikeButton({
  initialLikeState,
  itemId,
  isShop = false,
  className,
  onLikeChange,
  likedIcon = "/fillHeart.png",
  unlikedIcon = "/backheart.png",
}) {
  const [isLiked, setIsLiked] = useState(initialLikeState);
  console.log(isLiked);

  useEffect(() => {
    setIsLiked(initialLikeState);
  }, [initialLikeState]);

  const email = useSelector((state) => state.loginSlice.email);

  const handleClick = async (e) => {
    e.stopPropagation();

    if (!email) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "로그인이 필요합니다.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      const likeApi = isShop ? likeShop : likeProduct;
      const response = await likeApi(itemId);

      if (typeof response.data === "boolean") {
        setIsLiked(response.data);

        if (onLikeChange) {
          onLikeChange(response.data);
        }

        if (response.data) {
          Swal.fire({
            toast: true,
            position: "top",
            icon: "success",
            title: "찜 목록에 추가되었습니다.",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: false,
          });
        } else {
          Swal.fire({
            toast: true,
            position: "top",
            icon: "info",
            title: "찜 목록에서 삭제되었습니다.",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: false,
          });
        }
      }
    } catch (error) {
      console.error("찜 토글 오류:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "찜 추가/삭제 중 오류가 발생했습니다.",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    }
  };

  return (
    <button className={className} onClick={handleClick}>
      <img src={isLiked ? likedIcon : unlikedIcon} alt="찜하기" />
    </button>
  );
}

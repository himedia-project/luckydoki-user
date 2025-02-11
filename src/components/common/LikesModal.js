import React, { useState } from "react";
import Swal from "sweetalert2";
import style from "../../styles/LikesModal.module.css";

export default function LikesModal() {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      showToast();
    }
  };

  const showToast = () => {
    Swal.fire({
      toast: true,
      position: "top",
      icon: "success",
      title: "찜목록에 추가되었습니다.",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: false,
    });
  };

  return (
    <button onClick={handleLike} className={style.heart}>
      <img src={isLiked ? "/fillHeart.png" : "/backheart.png"} alt="찜하기" />
    </button>
  );
}

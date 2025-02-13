import React, { useState } from "react";
import Swal from "sweetalert2";
import { likeProduct, likeShop } from "../../api/likesApi";
import styles from "../../styles/ShopCard.module.css";
import { useNavigate } from "react-router-dom";

const DEFAULT_SHOP_IMAGE = "/images/default_shop.png";

const ShopCard = ({
  shopId,
  sellerNickname,
  shopImageUrl,
  likes,
  onUnlike,
}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(likes);
  const imageSrc = shopImageUrl || DEFAULT_SHOP_IMAGE;

  const handleLike = async () => {
    try {
      await likeShop(shopId);

      if (isLiked) {
        onUnlike(shopId);
      } else {
        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "찜목록에 추가되었습니다.",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: false,
        });
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error("찜 추가/삭제 실패:", error);
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

  // 상세 페이지 handler
  const handleCardClick = () => {
    navigate(`/shop/${shopId}`);
  };

  return (
    <div className={styles.shopCard} onClick={handleCardClick}>
      {/* 샵 이미지 */}
      <div className={styles.imageContainer}>
        <div className={styles.dim}></div>
        <img src={imageSrc} alt="샵 이미지" className={styles.shopImage} />
        <button
          className={styles.likeButton}
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
        >
          <img
            src={isLiked ? "/fillHeart.png" : "/backheart.png"}
            alt="찜하기"
          />
        </button>
      </div>

      {/* 샵 이름 */}
      <p className={styles.sellerNickname}>{sellerNickname}</p>
    </div>
  );
};

export default ShopCard;

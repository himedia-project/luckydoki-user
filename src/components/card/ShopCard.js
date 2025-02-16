import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/ShopCard.module.css";
import LikeButton from "../button/LikeButton";
import ImageLoader from "./ImageLoader";

const ShopCard = ({
  shopId,
  sellerNickname,
  shopImageUrl,
  likes,
  onUnlike,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/shop/${shopId}`);
  };

  return (
    <div className={styles.shopCard} onClick={handleCardClick}>
      {/* 샵 이미지 */}
      <div className={styles.imageContainer}>
        <div className={styles.dim}></div>
        <ImageLoader
          imagePath={shopImageUrl}
          alt="샵 이미지"
          className={styles.shopImage}
        />
        <LikeButton
          initialLikeState={likes}
          itemId={shopId}
          isShop={true}
          className={styles.likeButton}
          onLikeChange={(newState) => {
            if (!newState && onUnlike) {
              onUnlike(shopId);
            }
          }}
        />
      </div>

      {/* 샵 이름 */}
      <p className={styles.sellerNickname}>{sellerNickname}</p>
    </div>
  );
};

export default ShopCard;

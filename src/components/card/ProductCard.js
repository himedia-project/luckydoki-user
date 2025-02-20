import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/ProductCard.module.css";
import LikeButton from "../button/LikeButton";
import ImageLoader from "./ImageLoader";
import ReviewRating from "../ReviewRating";
import { getProductInfo } from "../../api/productApi";

const ProductCard = ({
  id,
  name,
  price,
  discountPrice,
  discountRate,
  productImageUrl,
  likes,
  isNew,
  event,
  best,
  onUnlike,
  reviewAverage,
  reviewCount,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className={styles.productCard} onClick={handleCardClick}>
      {/* ✅ 이미지 컨테이너 */}
      <div>
        <div className={styles.imageContainer}>
          <ImageLoader
            imagePath={productImageUrl}
            alt={name}
            className={styles.productImage}
          />
          {/* ✅ 하트(찜) 아이콘 */}
          <LikeButton
            initialLikeState={likes}
            itemId={id}
            isShop={false}
            className={styles.likeButton}
            onLikeChange={(newState) => {
              if (!newState && onUnlike) {
                onUnlike(id);
              }
            }}
          />
        </div>

        {/* ✅ 상품 이름 */}
        <p className={styles.productName}>{name}</p>

        {/* ✅ 할인율 & 가격 */}
        {discountRate > 0 ? (
          <>
            <div className={styles.productPrice}>
              <span className={styles.discountRate}>{discountRate}%</span>
              <span className={styles.price}>{price?.toLocaleString()}원</span>
            </div>
            <p className={styles.discountPrice}>
              {discountPrice?.toLocaleString()}원
            </p>
          </>
        ) : (
          <p className={styles.productPrice}>{price?.toLocaleString()}원</p>
        )}

        {/* ✅ 태그 버튼 (조건부 렌더링) */}
        <div className={styles.tagContainer}>
          {isNew === "Y" && <span className={styles.tagNew}>new</span>}
          {event === "Y" && <span className={styles.tagEvent}>event</span>}
          {best === "Y" && <span className={styles.tagBest}>best</span>}
        </div>
      </div>

      {/* ✅ 평균 별점 (데이터가 있을 때만 렌더링) */}
      <div className={styles.rating}>
        <ReviewRating rating={reviewAverage || 0} />
        <p className={styles.reviewCount}>({reviewCount || 0})</p>
      </div>
    </div>
  );
};

export default ProductCard;

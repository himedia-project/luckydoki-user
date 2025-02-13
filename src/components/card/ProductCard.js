import React, { useState } from "react";
import styles from "../../styles/ProductCard.module.css"; // ✅ 스타일 파일 불러오기

const DEFAULT_IMAGE = "/images/default_product.png";

const ProductCard = ({
  id,
  name,
  price,
  discountRate,
  imageUrl,
  isNew,
  event,
  best,
}) => {
  const [liked, setLiked] = useState(false); // 찜하기 상태

  // 찜하기 버튼 클릭 이벤트
  const toggleLike = () => {
    setLiked(!liked);
    // 추후 API 요청 추가 가능
  };

  return (
    <div className={styles.productCard}>
      {/* ✅ 이미지 컨테이너 */}
      <div className={styles.imageContainer}>
        <img
          src={imageUrl || DEFAULT_IMAGE}
          alt={name}
          className={styles.productImage}
        />
        {/* ✅ 하트(찜) 아이콘 */}
        <button className={styles.likeButton} onClick={toggleLike}>
          {liked ? "❤️" : "🤍"}
        </button>
      </div>

      {/* ✅ 상품 이름 */}
      <p className={styles.productName}>{name}</p>

      {/* ✅ 할인율 & 가격 */}
      <p className={styles.productPrice}>
        {discountRate > 0 && (
          <span className={styles.discountRate}>{discountRate}%</span>
        )}
        {price.toLocaleString()}원
      </p>

      {/* ✅ 태그 버튼 (조건부 렌더링) */}
      <div className={styles.tagContainer}>
        {isNew && <span className={styles.tagNew}>new</span>}
        {event && <span className={styles.tagEvent}>event</span>}
        {best && <span className={styles.tagBest}>best</span>}
      </div>
    </div>
  );
};

export default ProductCard;

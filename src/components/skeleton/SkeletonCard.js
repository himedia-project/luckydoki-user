import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "../../styles/ProductCard.module.css";

const SkeletonCard = () => {
  return (
    <div className={styles.productCard}>
      {/* ✅ 이미지 스켈레톤 */}
      <div className={styles.imageContainer}>
        <Skeleton height={243} width="100%" />
        <div className={styles.likeButton}>
          <Skeleton circle width={24} height={24} />
        </div>
      </div>

      {/* ✅ 상품 이름 */}
      <p className={styles.productName}>
        <Skeleton width="60%" />
      </p>

      {/* ✅ 가격 */}
      <div className={styles.productPrice}>
        <Skeleton width="40%" />
        <Skeleton width="60%" />
      </div>

      {/* ✅ 태그 */}
      <div className={styles.tagContainer}>
        <Skeleton width={40} height={20} />
        <Skeleton width={40} height={20} />
      </div>

      {/* ✅ 별점 */}
      <div className={styles.rating}>
        <Skeleton width={60} height={20} />
      </div>
    </div>
  );
};

export default SkeletonCard;

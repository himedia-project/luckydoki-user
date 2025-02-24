import React from "react";
import SkeletonCard from "./SkeletonCard"; // ✅ 스켈레톤 카드 추가
import styles from "../../styles/SkeletonSwiper.module.css";

const SkeletonSwiper = ({ title }) => {
  console.log("🔥 SkeletonSwiper 렌더링됨:", title);

  return (
    <div className={styles.skeletonSection}>
      <h2>{title}</h2>
      <div className={styles.skeletonGrid}>
        {Array(5)
          .fill()
          .map((_, index) => (
            <SkeletonCard key={`row1-${index}`} />
          ))}
      </div>

      <div className={styles.skeletonGrid}>
        {Array(5)
          .fill()
          .map((_, index) => (
            <SkeletonCard key={`row2-${index}`} />
          ))}
      </div>
    </div>
  );
};

export default SkeletonSwiper;

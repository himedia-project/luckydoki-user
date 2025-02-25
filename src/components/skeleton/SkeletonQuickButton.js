import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "../../styles/SkeletonQuickButton.module.css"; // ✅ 스타일 추가

const SkeletonQuickButton = () => {
  return (
    <div className={styles.skeletonContainer}>
      <ul className={styles.skeletonNav}>
        {Array(10)
          .fill()
          .map((_, index) => (
            <li key={index} className={styles.skeletonItem}>
              <div className={styles.imageContainer}>
                <Skeleton className={styles.skeletonImage} />{" "}
                {/* ✅ 아이콘 크기 조정 */}
              </div>
              <Skeleton
                width="60%"
                height={14}
                className={styles.skeletonText}
              />{" "}
              {/* ✅ 텍스트 크기 조정 */}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SkeletonQuickButton;

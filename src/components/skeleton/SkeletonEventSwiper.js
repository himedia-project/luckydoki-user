import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "../../styles/SkeletonEventSwiper.module.css";

const SkeletonEventSwiper = () => {
  return (
    <div className={styles.skeletonSwiperContainer}>
      <button
        className={`${styles.skeletonNavButton} ${styles.skeletonPrevButton}`}
      >
        <Skeleton circle width={34} height={34} />
      </button>

      <div className={styles.skeletonSlide}>
        <Skeleton className={styles.skeletonImage} />
      </div>
      <div className={styles.skeletonSlide}>
        <Skeleton className={styles.skeletonImage} />
      </div>
      <div className={styles.skeletonSlide}>
        <Skeleton className={styles.skeletonImage} />
      </div>

      <button
        className={`${styles.skeletonNavButton} ${styles.skeletonNextButton}`}
      >
        <Skeleton circle width={34} height={34} />
      </button>
    </div>
  );
};

export default SkeletonEventSwiper;

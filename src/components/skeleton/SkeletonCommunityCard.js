import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "../../styles/SkeletonCommunityCard.module.css";

const SkeletonCommunityCard = () => {
  return (
    <div className={styles.skeletonCommunityCard}>
      <div className={styles.header}>
        <Skeleton className={styles.sellerImage} />
        <div className={styles.userInfo_box}>
          <Skeleton width={100} height={14} className={styles.author} />
        </div>
      </div>

      <div className={styles.imageContainer}>
        <Skeleton height={624} width="100%" />
      </div>

      <div className={styles.tagList}>
        <div className={styles.tagInfoBox}>
          <div className={styles.productImageContainer}>
            <Skeleton width={100} height={100} />
          </div>
        </div>
        <div className={styles.tagInfoBox}>
          <div className={styles.InfoBox}>
            <Skeleton width="80%" height={16} />
          </div>
        </div>
      </div>

      <div className={styles.cardContent}>
        <Skeleton count={3} className={styles.skeletonText} />
      </div>

      <div className={styles.comment_box}>
        <Skeleton
          circle
          width={18}
          height={18}
          className={styles.comment_img}
        />
        <Skeleton width={80} height={14} className={styles.comment} />
      </div>
    </div>
  );
};

export default SkeletonCommunityCard;

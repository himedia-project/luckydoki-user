import React from "react";
import styles from "../../styles/ReviewCard.module.css";
import ReviewRating from "../ReviewRating";
import ImageLoader from "./ImageLoader";

const ReviewCard = ({ review }) => {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.user_info}>
        <ImageLoader
          imagePath={review.shopImage}
          alt=""
          className={styles.profile}
        />
        <div className={styles.info_box}>
          <p className={styles.nickname}>도성곤</p>
          <div className={styles.sub_info}>
            <ReviewRating rating={review.rating} />
            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className={styles.content_container}>
        {review.imageName && (
          <div className={styles.imageContainer}>
            <ImageLoader
              imagePath={review.imageName}
              alt={review.productName}
              className={styles.productImage}
            />
          </div>
        )}
        <div className={styles.reviewContent}>
          <p>{review.content}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;

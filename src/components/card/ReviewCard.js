import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../api/imageApi";
import styles from "../../styles/ReviewCard.module.css";
import ReviewRating from "../ReviewRating";

const ReviewCard = ({ review }) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (review.imageName) {
      getImageUrl(review.imageName).then((imageUrl) => setImageSrc(imageUrl));
    }
  }, [review.imageName]);

  return (
    <div className={styles.reviewCard}>
      <div className={styles.user_info}>
        <img src="profile.png" alt="" className={styles.profile} />
        <div className={styles.info_box}>
          <p className={styles.nickname}>도성곤</p>
          <div className={styles.sub_info}>
            <ReviewRating rating={review.rating} />
            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className={styles.content_container}>
        {imageSrc && (
          <div className={styles.imageContainer}>
            <img
              src={imageSrc}
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

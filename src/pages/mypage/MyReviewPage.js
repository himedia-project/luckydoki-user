import React, { useEffect, useState } from "react";
import style from "../../styles/MyReview.module.css";
import { getReviewByMember } from "../../api/reviewApi";
import ReviewCard from "../../components/card/ReviewCard";

export default function MyReviewPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getReviewByMember()
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("리뷰 불러오기 실패:", error);
      });
  }, []);

  return (
    <div className={style.review_container}>
      <h2>나의 리뷰</h2>
      <div className={style.content_box}>
        {reviews.length > 0 ? (
          <div className={style.review_list}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p>작성한 리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

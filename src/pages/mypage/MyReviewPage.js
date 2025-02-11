import React from "react";
import style from "../../styles/MyReview.module.css";

export default function MyReviewPage() {
  return (
    <div className={style.review_container}>
      <h2>나의 리뷰</h2>
      <div className={style.content_box}>
        <p>작성한 리뷰가 없습니다.</p>
      </div>
    </div>
  );
}

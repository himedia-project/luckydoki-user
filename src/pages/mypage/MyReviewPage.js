import React, { useEffect, useState } from "react";
import style from "../../styles/MyReview.module.css";
import { getReviewByMember } from "../../api/reviewApi";
import ReviewCard from "../../components/card/ReviewCard";
import { getProductInfo } from "../../api/productApi";
import { useNavigate } from "react-router-dom";
import ReviewProductCard from "../../components/card/ReviewProductCard";

export default function MyReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getReviewByMember()
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("리뷰 불러오기 실패:", error);
      });
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      const fetchProducts = async () => {
        try {
          const productPromises = reviews
            .map((review) => review.productId) // 리뷰에서 productId 추출
            .filter(Boolean) // undefined 제거
            .map(async (productId) => {
              const response = await getProductInfo(productId);
              return { productId, data: response.data };
            });

          const productResults = await Promise.all(productPromises);

          // productId를 key로 하는 객체 생성
          const productMap = productResults.reduce((acc, curr) => {
            acc[curr.productId] = curr.data;
            return acc;
          }, {});

          setProducts(productMap);
        } catch (error) {
          console.error("상품 불러오기 실패:", error);
        }
      };

      fetchProducts();
    }
  }, [reviews]);

  const handleProductClick = (productId, event) => {
    event.stopPropagation();
    navigate(`/product/${productId}`);
  };

  return (
    <div className={style.review_container}>
      <h2>나의 리뷰</h2>
      <div className={style.content_box}>
        {reviews.length > 0 ? (
          <div className={style.review_list}>
            {reviews.map((review) => (
              <div key={review.id} className={style.review_item}>
                <ReviewCard review={review} />
                {products[review.productId] && (
                  <div className={style.productInfo}>
                    <ReviewProductCard
                      productDTOs={[products[review.productId]]} // 해당 리뷰의 상품 정보만 전달
                      handleProductClick={handleProductClick}
                      limit={1} // 한 개만 표시
                      hideSwiper
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>작성한 리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

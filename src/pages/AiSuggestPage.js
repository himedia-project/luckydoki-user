import React, { useEffect, useState } from "react";
import style from "../styles/AiSuggestPage.module.css";
import ProductCard from "../components/card/ProductCard";
import { getRecommendProductList } from "../api/productApi";

export default function AiSuggestPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const interval = setInterval(() => {
          setAnalysisProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 0.2;
          });
        }, 100);

        const response = await getRecommendProductList();
        console.log("Fetched products:", response.data); // 데이터 확인용 로그
        setProducts(response.data);

        setTimeout(() => {
          setAnalysisProgress(100);
          setTimeout(() => {
            setLoading(false);
            clearInterval(interval);
          }, 1000);
        }, 500);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className={style.productContainer}>
      <div className={style.titleSection}>
        <h2 className={style.title}>AI 추천상품</h2>
        <div className={style.aiIndicator}>
          <div className={style.pulse}></div>
          <span>AI가 당신을 위한 상품을 분석중입니다</span>
        </div>
      </div>
      <div className={style.contentBox}>
        {loading ? (
          <div className={style.loadingContainer}>
            <div className={style.analysisBox}>
              <div className={style.progressText}>
                AI 분석 진행률: {Math.floor(analysisProgress)}%
              </div>
              <div className={style.progressBar}>
                <div
                  className={style.progressFill}
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
              <div className={style.analysisSteps}>
                {analysisProgress < 25 && "사용자 선호도 분석 중..."}
                {analysisProgress >= 25 &&
                  analysisProgress < 50 &&
                  "상품 데이터 수집 중..."}
                {analysisProgress >= 50 &&
                  analysisProgress < 75 &&
                  "맞춤 상품 선별 중..."}
                {analysisProgress >= 75 &&
                  analysisProgress < 95 &&
                  "추천 목록 생성 중..."}
                {analysisProgress >= 95 && "분석 완료!"}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={style.completionMessage}>
              <span className={style.checkmark}>✓</span>
              분석이 완료되었습니다!
            </div>
            <div className={style.productGrid}>
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={style.productItem}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    discountRate={product.discountRate}
                    discountPrice={product.discountPrice}
                    productImageUrl={
                      product.uploadFileNames?.length > 0
                        ? product.uploadFileNames[0]
                        : null
                    }
                    isNew={product.isNew}
                    event={product.event}
                    likes={product.likes}
                    best={product.best}
                    reviewAverage={product.reviewAverage}
                    reviewCount={product.reviewCount}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategoryId } from "../api/categoryApi";
import ProductCard from "../components/card/ProductCard";
import style from "../styles/CategoryListPage.module.css";
import SkeletonCard from "../components/skeleton/SkeletonCard";

const CategoryListPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true); // 🔥 추가: 스켈레톤 상태

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId || isNaN(Number(categoryId))) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getProductsByCategoryId(categoryId);

        if (!response || !response.data || !Array.isArray(response.data)) {
          throw new Error("잘못된 응답 형식");
        }

        setProducts(response.data);
      } catch (error) {
        console.error("상품 불러오기 실패:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    fetchProducts();
  }, [categoryId]);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setShowSkeleton(false); 
      }, 200);
    }
  }, [isLoading]);

  return (
    <div className={style.productListContainer}>
      {isLoading && showSkeleton ? (
        <div className={style.skeletonGrid}>
          {Array(10)
            .fill()
            .map((_, index) => (
              <SkeletonCard key={index} />
            ))}
        </div>
      ) : (
        <div className={style.productGrid}>
          {products.length === 0 ? (
            <p className={style.emptyMessage}>
              해당 카테고리에 상품이 없습니다.
            </p>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
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
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryListPage;

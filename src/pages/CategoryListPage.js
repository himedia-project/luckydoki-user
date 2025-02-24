import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategoryId } from "../api/categoryApi";
import ProductCard from "../components/card/ProductCard";
import style from "../styles/CategoryListPage.module.css";

const CategoryListPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId || isNaN(Number(categoryId))) {
        setError("올바른 카테고리 ID가 아닙니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getProductsByCategoryId(categoryId);

        // ✅ API 응답 데이터 구조 확인
        if (!response || !response.data || !Array.isArray(response.data)) {
          throw new Error("잘못된 응답 형식");
        }

        setProducts(response.data);
      } catch (error) {
        console.error("상품 불러오기 실패:", error);
        setError("상품을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return (
    <div className={style.productListContainer}>
      {error && <p className={style.error}>{error}</p>}

      {products.map((product) => (
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
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default CategoryListPage;

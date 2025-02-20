import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategoryId } from "../api/categoryApi";
import ProductCard from "../components/card/ProductCard";
import style from "../styles/CategoryListPage.module.css";
import QuickButtonNav from "../components/QuickButtonNav";

const CategoryListPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      // ✅ categoryId가 유효한지 확인
      if (!categoryId || isNaN(Number(categoryId))) {
        setError("올바른 카테고리 ID가 아닙니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
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
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return (
    <div className={style.productListContainer}>
      {/* ✅ 로딩 상태 처리 */}
      {loading && <p className={style.loading}>상품을 불러오는 중...</p>}

      {/* ✅ 에러 메시지 표시 */}
      {error && <p className={style.error}>{error}</p>}

      {/* ✅ 상품 목록 렌더링 */}
      {!loading && !error && products.length > 0
        ? products.map((product) => (
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
            />
          ))
        : !loading &&
          !error && <p className={style.noProduct}>상품이 없습니다.</p>}
    </div>
  );
};

export default CategoryListPage;

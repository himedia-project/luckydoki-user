import React, { useEffect, useState } from "react";
import { getProductList } from "../../api/productApi";
import ProductCard from "../../components/card/ProductCard";
import SkeletonCard from "../../components/skeleton/SkeletonCard";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";
import style from "../../styles/ProductListPage.module.css";
import TopButton from "../../components/button/TopButton";

const PopularPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getProductList();

        console.log("📌 전체 응답 데이터:", response);

        // ✅ best === "Y" 인 상품들만 필터링
        const bestProducts = response.data.filter(
          (product) => product?.best === "Y"
        );

        console.log("🔥 인기 상품 개수:", bestProducts.length);
        setProducts(bestProducts);
      } catch (error) {
        console.error("인기 상품 불러오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  return (
    <>
      <Header />
      <div className={style.productListContainer}>
        <h2 className={style.pageTitle}>인기상품</h2>

        <div className={style.productGrid}>
          {isLoading
            ? Array(20)
                .fill()
                .map((_, index) => <SkeletonCard key={index} />)
            : products.map((product) => (
                <ProductCard
                  key={product?.id}
                  id={product?.id}
                  name={product?.name}
                  price={product?.price}
                  discountRate={product?.discountRate}
                  discountPrice={product?.discountPrice}
                  productImageUrl={
                    product.uploadFileNames?.length > 0
                      ? product.uploadFileNames[0]
                      : null
                  }
                  isNew={product?.isNew}
                  event={product?.event}
                  likes={product?.likes}
                  best={product?.best}
                  reviewAverage={product?.reviewAverage}
                  reviewCount={product?.reviewCount}
                />
              ))}
        </div>

        <TopButton />
      </div>
      <Footer />
    </>
  );
};

export default PopularPage;

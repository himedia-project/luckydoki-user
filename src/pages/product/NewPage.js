import React, { useEffect, useState } from "react";
import { getProductList } from "../../api/productApi";
import ProductCard from "../../components/card/ProductCard";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";
import style from "../../styles/ProductListPage.module.css";
import TopButton from "../../components/button/TopButton";

const NewPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getProductList("");

        // ✅ isNew === "Y" 인 상품들만 필터링
        const newProducts = response.data.filter(
          (product) => product.isNew === "Y"
        );

        setProducts(newProducts);
      } catch (error) {
        console.error("신규 상품 불러오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  return (
    <>
      <Header />

      <div className={style.productListContainer}>
        <h2 className={style.pageTitle}>최신상품</h2>
        {
          <div className={style.productGrid}>
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
        }
        <TopButton />
      </div>

      <Footer />
    </>
  );
};

export default NewPage;

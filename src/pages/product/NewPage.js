import React, { useEffect, useState } from "react";
import { getProductList } from "../../api/productApi";
import ProductCard from "../../components/card/ProductCard";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";
import style from "../../styles/ProductListPage.module.css";

const NewPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await getProductList();

        // ✅ isNew === "Y" 인 상품들만 필터링
        const newProducts = response.data.filter(
          (product) => product.isNew === "Y"
        );

        console.log("상품 개수:", newProducts.length); // ✅ 상품 개수 확인
        setProducts(newProducts);
      } catch (error) {
        console.error("신규 상품 불러오기 실패:", error);
      }
    };

    fetchNewProducts();
  }, []);

  console.log("NewPage 렌더링됨"); // ✅ 페이지가 렌더링되는지 확인

  return (
    <>
      <Header />

      <div className={style.productListContainer}>
        <h2 className={style.pageTitle}>신규 상품</h2>
        {products.length > 0 ? (
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
              />
            ))}
          </div>
        ) : (
          <p className={style.noProduct}>⚠️ 상품을 불러오고 있습니다.</p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default NewPage;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import QuickButtonNav from "../components/QuickButtonNav";
import EventSwiper from "../components/swiper/EventSwiper";
import ProductSwiper from "../components/swiper/ProductSwiper";
import styles from "../styles/HomePage.module.css";
import { getProductList } from "../api/productApi";
import SkeletonSwiper from "../components/skeleton/SkeletonSwiper";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [likedProducts, setLikedProducts] = useState(new Set());

  const accessToken = useSelector((state) => state.loginSlice.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const eventRes = await axiosInstance.get(`/event/list`);
        setEvents(eventRes.data);

        const productRes = await getProductList();
        const allProducts = productRes.data;
        setProducts(allProducts);
        const initialLikes = new Set(
          allProducts
            .filter((product) => product.likes)
            .map((product) => product.id)
        );
        setLikedProducts(initialLikes);
        setRandomProducts(
          allProducts.sort(() => 0.5 - Math.random()).slice(0, 20)
        );
        setNewProducts(allProducts.filter((product) => product.isNew === "Y"));
        setBestProducts(allProducts.filter((product) => product.best === "Y"));
        setDiscountedProducts(
          allProducts.filter((product) => product.discountRate >= 50)
        );
      } catch (error) {
        console.error("🚨 데이터 가져오기 실패:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchData();
  }, [accessToken]);

  // ✅ 찜 상태 변경 핸들러 (전체 컴포넌트에서 공유)
  const handleLikeChange = (productId, isLiked) => {
    setLikedProducts((prev) => {
      const newLikes = new Set(prev);
      isLiked ? newLikes.add(productId) : newLikes.delete(productId);
      return newLikes;
    });
  };

  return (
    <div className={styles.container}>
      <EventSwiper events={events} />
      <div className={styles.quickButton}>
        <QuickButtonNav />
      </div>

      <section className={styles.section}>
        {isLoading ? (
          <SkeletonSwiper title="이 상품을 찾으시나요?" />
        ) : (
          <ProductSwiper
            title="이 상품을 찾으시나요?"
            items={randomProducts}
            likedProducts={likedProducts}
            onLikeChange={handleLikeChange}
          />
        )}
      </section>

      <section className={styles.section}>
        {isLoading ? (
          <SkeletonSwiper title="신규 상품" />
        ) : (
          <ProductSwiper
            title="신규 상품"
            items={newProducts}
            likedProducts={likedProducts}
            onLikeChange={handleLikeChange}
          />
        )}
      </section>

      <section className={styles.section}>
        {isLoading ? (
          <SkeletonSwiper title="베스트 상품" />
        ) : (
          <ProductSwiper
            title="베스트 상품"
            items={bestProducts}
            likedProducts={likedProducts}
            onLikeChange={handleLikeChange}
          />
        )}
      </section>

      <section className={styles.section}>
        {isLoading ? (
          <SkeletonSwiper title="사장님이 미쳤어요! 대폭 할인 상품" />
        ) : (
          <ProductSwiper
            title="사장님이 미쳤어요! 대폭 할인 상품"
            items={discountedProducts}
            likedProducts={likedProducts}
            onLikeChange={handleLikeChange}
          />
        )}
      </section>
    </div>
  );
};

export default HomePage;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import QuickButtonNav from "../components/QuickButtonNav";
import EventSwiper from "../components/swiper/EventSwiper";
import ProductSwiper from "../components/swiper/ProductSwiper";
import styles from "../styles/HomePage.module.css";
import { getProductList } from "../api/productApi";
import SkeletonSwiper from "../components/skeleton/SkeletonSwiper";
import SkeletonEventSwiper from "../components/skeleton/SkeletonEventSwiper";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState();

  const accessToken = useSelector((state) => state.loginSlice.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // ✅ 이벤트 데이터 가져오기
        const eventRes = await axiosInstance.get(`/event/list`);
        setEvents(eventRes.data);

        const productRes = await getProductList();

        const allProducts = productRes.data;
        setProducts(allProducts);

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
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <div className={styles.container}>
      {isLoading ? (
        <SkeletonEventSwiper title="이 상품을 찾으시나요?" />
      ) : (
        <EventSwiper events={events} />
      )}
      <div className={styles.quickButton}>
        <QuickButtonNav />
      </div>

      <section className={styles.section}>
        {isLoading ? (
          <SkeletonSwiper title="이 상품을 찾으시나요?" />
        ) : (
          <ProductSwiper title="이 상품을 찾으시나요?" items={randomProducts} />
        )}
      </section>

      <section className={styles.section}>
        {isLoading ? (
          <SkeletonSwiper title="신규 상품" />
        ) : (
          <ProductSwiper title="신규 상품" items={newProducts} />
        )}
      </section>

      <section className={styles.section}>
        {isLoading ? (
          <SkeletonSwiper title="베스트 상품" />
        ) : (
          <ProductSwiper title="베스트 상품" items={bestProducts} />
        )}
      </section>

      <section className={styles.section}>
        {isLoading ? (
          <SkeletonSwiper title="사장님이 미쳤어요! 대폭 할인 상품" />
        ) : (
          <ProductSwiper
            title="사장님이 미쳤어요! 대폭 할인 상품"
            items={discountedProducts}
          />
        )}
      </section>
    </div>
  );
};

export default HomePage;

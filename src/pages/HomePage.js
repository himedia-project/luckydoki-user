import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../config/apiConfig";
import ProductSwiper from "../components/swiper/ProductSwiper";
import EventSwiper from "../components/swiper/EventSwiper";
import styles from "../styles/HomePage.module.css";
import QuickButtonNav from "../components/QuickButtonNav";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);

  const accessToken = useSelector((state) => state.loginSlice.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ 이벤트 데이터 가져오기
        const eventRes = await axios.get(`${API_URL}/api/event/active`, {
          withCredentials: true,
        });
        setEvents(eventRes.data);

        const productRes = await axios.get(`${API_URL}/api/product/list`, {
          withCredentials: true,
        });

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
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <div className={styles.container}>
      <EventSwiper events={events} />
      <div className={styles.quickButton}>
        <QuickButtonNav />
      </div>

      <section className={styles.section}>
        <ProductSwiper title="이 상품을 찾으시나요?" items={randomProducts} />
      </section>
      <section className={styles.section}>
        <ProductSwiper title="신규 상품" items={newProducts} />
      </section>
      <section className={styles.section}>
        <ProductSwiper title="베스트 상품" items={bestProducts} />
      </section>
      <section className={styles.section}>
        <ProductSwiper
          title="사장님이 미쳤어요! 대폭 할인 상품"
          items={discountedProducts}
        />
      </section>
    </div>
  );
};

export default HomePage;

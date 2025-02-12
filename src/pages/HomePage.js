import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "../styles/HomePage.module.css";
import { API_URL } from "../config/apiConfig";

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
        const headers = accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {};

        // ✅ 이벤트 데이터 가져오기
        const eventRes = await axios.get(`${API_URL}/api/event/active`, {
          headers,
          withCredentials: true,
        });
        setEvents(eventRes.data);

        // ✅ 상품 데이터 가져오기
        const productRes = await axios.get(`${API_URL}/api/product`, {
          headers,
          withCredentials: true,
        });

        const allProducts = productRes.data;
        setProducts(allProducts);

        setRandomProducts(
          allProducts.sort(() => 0.5 - Math.random()).slice(0, 10)
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

  const BASE_IMAGE_URL = "https://your-s3-bucket-url.com/uploads";
  const DEFAULT_IMAGE = "/images/default_product.png";

  // ✅ Swiper 컴포넌트 렌더링 함수
  const renderSwiper = (title, items) => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {items.length > 0 ? (
        <Swiper
          spaceBetween={10}
          slidesPerView={4}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <div className={styles.productCard}>
                <img
                  src={
                    item.uploadFileNames?.length > 0
                      ? `${BASE_IMAGE_URL}/${item.uploadFileNames[0]}`
                      : DEFAULT_IMAGE
                  }
                  alt={item.name}
                  className={styles.productImage}
                />
                <p className={styles.productName}>{item.name}</p>
                <p className={styles.productPrice}>
                  {item.price.toLocaleString()}원
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className={styles.emptyMessage}>현재 표시할 상품이 없습니다.</p>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      {/* ✅ 진행 중인 이벤트 Swiper */}
      {events.length > 0 ? (
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          className={styles.eventSwiper}
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <img
                src={event.image} // ✅ 이벤트 이미지 필드 확인
                alt={event.title}
                className={styles.eventImage}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className={styles.emptyMessage}>현재 진행 중인 이벤트가 없습니다.</p>
      )}

      {/* ✅ 상품 리스트 Swiper */}
      {renderSwiper("이 상품을 찾으시나요?", randomProducts)}
      {renderSwiper("신규 상품", newProducts)}
      {renderSwiper("베스트 상품", bestProducts)}
      {renderSwiper("사장님이 미쳤어요! 대폭 할인 상품", discountedProducts)}
    </div>
  );
};

export default HomePage;

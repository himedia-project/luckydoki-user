import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "../../styles/ProductSwiper.module.css";
import ProductCard from "../card/ProductCard";

const ProductSwiper = ({ title, items }) => {
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // ✅ 항상 실행되도록 useEffect를 조건문 바깥으로 이동
  useEffect(() => {
    setTimeout(() => {
      if (swiperRef.current?.swiper) {
        swiperRef.current.swiper.params.navigation.prevEl = prevRef.current;
        swiperRef.current.swiper.params.navigation.nextEl = nextRef.current;
        swiperRef.current.swiper.navigation.init();
        swiperRef.current.swiper.navigation.update();
      }
    }, 100);
  }, []);

  if (!items || items.length === 0) {
    return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.emptyMessage}>현재 표시할 상품이 없습니다.</p>
      </div>
    );
  }

  // ✅ 2개씩 묶어서 행으로 그룹화
  const groupedItems = [];
  for (let i = 0; i < items.length; i += 2) {
    groupedItems.push(items.slice(i, i + 2));
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <Swiper
        ref={swiperRef}
        spaceBetween={10}
        slidesPerView={5}
        loop={items.length > 5}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        modules={[Navigation, Pagination]}
        breakpoints={{
          1280: { slidesPerView: 5 },
          1024: { slidesPerView: 4 },
          768: { slidesPerView: 2 },
          480: { slidesPerView: 1 },
        }}
      >
        {groupedItems.map((group, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <div className={styles.productRow}>
              {group.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  discountRate={item.discountRate}
                  discountPrice={item.discountPrice}
                  productImageUrl={
                    item.uploadFileNames?.length > 0
                      ? item.uploadFileNames[0]
                      : null
                  }
                  isNew={item.isNew}
                  event={item.event}
                  likes={item.likes}
                  best={item.best}
                />
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ✅ Swiper 개별 네비게이션 버튼 */}
      <button
        ref={prevRef}
        className={`${styles.navButton} ${styles.prevButton}`}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        ref={nextRef}
        className={`${styles.navButton} ${styles.nextButton}`}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default ProductSwiper;

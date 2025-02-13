import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "../../styles/ProductSwiper.module.css";
import ProductCard from "../card/ProductCard"; // ✅ 공용 컴포넌트
import { API_URL } from "../../config/apiConfig";

const ProductSwiper = ({ title, items }) => {
  if (!items || items.length === 0) {
    return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.emptyMessage}>현재 표시할 상품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
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
            <ProductCard
              id={item.id}
              name={item.name}
              price={item.price}
              discountRate={item.discount_rate} // ✅ 할인율 추가
              imageUrl={
                item.uploadFileNames?.length > 0
                  ? `${API_URL}/api/image/view/${item.uploadFileNames[0]}`
                  : null
              }
              isNew={item.is_new}
              event={item.event}
              best={item.best}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSwiper;

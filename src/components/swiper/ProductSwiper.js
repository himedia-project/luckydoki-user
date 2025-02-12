import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "../../styles/ProductSwiper.module.css";
import { API_URL } from "../../config/apiConfig"; // ✅ API URL 가져오기

const DEFAULT_IMAGE = "/images/default_product.png";

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
            <div className={styles.productCard}>
              <img
                src={
                  item.uploadFileNames?.length > 0
                    ? `${API_URL}/api/image/view/${item.uploadFileNames[0]}`
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
    </div>
  );
};

export default ProductSwiper;

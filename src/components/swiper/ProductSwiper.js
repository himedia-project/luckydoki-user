import React, { useEffect, useRef, useState } from "react";
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
  const [swiperId] = useState(
    () => `swiper-${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (swiperRef.current && swiperRef.current.swiper) {
        const swiperInstance = swiperRef.current.swiper;
        swiperInstance.params.navigation.prevEl = `.${swiperId}-prev`;
        swiperInstance.params.navigation.nextEl = `.${swiperId}-next`;
        swiperInstance.navigation.init();
        swiperInstance.navigation.update();
        swiperInstance.params.pagination.el = `.${swiperId}-pagination`;
        swiperInstance.pagination.init();
        swiperInstance.pagination.update();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [swiperId]);

  if (!items || items.length === 0) {
    return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.emptyMessage}>현재 표시할 상품이 없습니다.</p>
      </div>
    );
  }

  const groupedItems = [];
  for (let i = 0; i < items.length; i += 10) {
    const group = items.slice(i, i + 10);
    while (group.length < 10) {
      group.push(null);
    }
    groupedItems.push(group);
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <Swiper
        ref={swiperRef}
        key={groupedItems.length}
        spaceBetween={10}
        slidesPerView={1}
        slidesPerGroup={1}
        loop={groupedItems.length > 1}
        observer={true}
        observeParents={true}
        pagination={{
          el: `.${swiperId}-pagination`,
          clickable: true,
        }}
        navigation={{
          prevEl: `.${swiperId}-prev`,
          nextEl: `.${swiperId}-next`,
        }}
        modules={[Navigation, Pagination]}
      >
        {groupedItems.map((group, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <div className={styles.gridContainer}>
              {group.map((item, i) =>
                item ? (
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
                    reviewAverage={item.reviewAverage}
                    reviewCount={item.reviewCount}
                  />
                ) : (
                  <div
                    key={`empty-${index}-${i}`}
                    className={styles.emptySlot}
                  />
                )
              )}
            </div>
          </SwiperSlide>
        ))}
        <div className={`${swiperId}-pagination ${styles.customPagination}`} />
      </Swiper>
      <button
        className={`${swiperId}-prev ${styles.navButton} ${styles.prevButton}`}
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
        className={`${swiperId}-next ${styles.navButton} ${styles.nextButton}`}
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

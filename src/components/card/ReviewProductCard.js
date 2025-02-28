import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ImageLoader from "../card/ImageLoader";
import styles from "../../styles/ReviewProductCard.module.css";

const ReviewProductCard = ({ productDTOs, handleProductClick, hideSwiper }) => {
  // Always call hooks at the top level
  const swiperRef = useRef(null);
  const taggedPrevRef = useRef(null);
  const taggedNextRef = useRef(null);

  // Prepare grouped items if productDTOs exist
  const groupedItems = [];
  if (productDTOs) {
    for (let i = 0; i < productDTOs.length; i += 2) {
      groupedItems.push(productDTOs.slice(i, i + 2));
    }
  }

  useEffect(() => {
    // Only initialize Swiper navigation if hideSwiper is false
    if (!hideSwiper) {
      setTimeout(() => {
        if (swiperRef.current?.swiper) {
          swiperRef.current.swiper.params.navigation.prevEl =
            taggedPrevRef.current;
          swiperRef.current.swiper.params.navigation.nextEl =
            taggedNextRef.current;
          swiperRef.current.swiper.navigation.init();
          swiperRef.current.swiper.navigation.update();
        }
      }, 100);
    }
  }, [hideSwiper]);

  // Early return if no products
  if (!productDTOs || productDTOs.length === 0) return null;

  // Conditionally render grid-only version when hideSwiper is true
  if (hideSwiper) {
    return (
      <div className={styles.taggedProductsContainer}>
        <div className={styles.productGrid}>
          {productDTOs.slice(0, 2).map((product) => (
            <div
              key={product.id}
              className={styles.tagInfoBox}
              onClick={(event) => handleProductClick(product.id, event)}
            >
              <div className={styles.productImageContainer}>
                <ImageLoader
                  imagePath={product.uploadFileNames[0]}
                  alt={product.name}
                  className={styles.productImage}
                />
              </div>
              <div className={styles.infoBox}>
                <p className={styles.title}>{product.name}</p>
                {product.discountRate > 0 && (
                  <div className={styles.rateBox}>
                    <b className={styles.rate}>{product.discountRate}%</b>
                    <b className={styles.price}>
                      {product.price?.toLocaleString()}원
                    </b>
                  </div>
                )}
                <b className={styles.discountPrice}>
                  {product.discountPrice?.toLocaleString()}원
                </b>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Otherwise, render the Swiper version
  return (
    <div className={styles.taggedProductsContainer}>
      <Swiper
        ref={swiperRef}
        spaceBetween={10}
        slidesPerView={1}
        loop={groupedItems.length > 1}
        navigation={{
          prevEl: taggedPrevRef.current,
          nextEl: taggedNextRef.current,
        }}
        pagination={{ clickable: true }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = taggedPrevRef.current;
          swiper.params.navigation.nextEl = taggedNextRef.current;
        }}
        modules={[Navigation, Pagination]}
        className={styles.taggedSwiper}
      >
        {groupedItems.map((group, index) => (
          <SwiperSlide key={index}>
            <div className={styles.productGrid}>
              {group.map((product) => (
                <div
                  key={product.id}
                  className={styles.tagInfoBox}
                  onClick={(event) => handleProductClick(product.id, event)}
                >
                  <div className={styles.productImageContainer}>
                    <ImageLoader
                      imagePath={product.uploadFileNames[0]}
                      alt={product.name}
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.infoBox}>
                    <p className={styles.title}>{product.name}</p>
                    {product.discountRate > 0 && (
                      <div className={styles.rateBox}>
                        <b className={styles.rate}>{product.discountRate}%</b>
                        <b className={styles.price}>
                          {product.price?.toLocaleString()}원
                        </b>
                      </div>
                    )}
                    <b className={styles.discountPrice}>
                      {product.discountPrice?.toLocaleString()}원
                    </b>
                  </div>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Render navigation buttons only if there are more than 2 products */}
      {productDTOs.length > 2 && (
        <>
          <button
            ref={taggedPrevRef}
            className={`${styles.taggedNavButton} ${styles.taggedPrevButton}`}
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
            ref={taggedNextRef}
            className={`${styles.taggedNavButton} ${styles.taggedNextButton}`}
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
        </>
      )}
    </div>
  );
};

export default ReviewProductCard;

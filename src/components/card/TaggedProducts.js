import React from "react";
import ImageLoader from "../card/ImageLoader";
import styles from "../../styles/TaggedProducts.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TaggedProducts = ({
  productDTOs,
  handleProductClick,
  prevRef,
  nextRef,
}) => {
  if (!productDTOs || productDTOs.length === 0) return null;

  return (
    <div className={styles.taggedProductsContainer}>
      <h3 className={styles.tagTitle}>태그된 작품 {productDTOs.length}개</h3>

      <div className={styles.swiperWrapper}>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={productDTOs.length < 2 ? 1 : 2}
          navigation={{
            prevEl: prevRef?.current,
            nextEl: nextRef?.current,
          }}
          pagination={{ clickable: true }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef?.current;
            swiper.params.navigation.nextEl = nextRef?.current;
          }}
          preventClicksPropagation={false}
          className={styles.productSwiper}
        >
          {productDTOs.map((product) => (
            <SwiperSlide key={product.id}>
              <div
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
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          ref={prevRef}
          className={`${styles.navButton} ${styles.prevButton}`}
        >
          &lt;
        </button>
        <button
          ref={nextRef}
          className={`${styles.navButton} ${styles.nextButton}`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default TaggedProducts;

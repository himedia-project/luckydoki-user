import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "../../styles/EventSwiper.module.css";
import ImageLoader from "../card/ImageLoader";

const EventSwiper = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <p className={styles.emptyMessage}>현재 진행 중인 이벤트가 없습니다.</p>
    );
  }

  return (
    <div className={styles.swiperContainer}>
      <Swiper
        spaceBetween={20}
        centeredSlides={true}
        slidesPerView={"auto"}
        loop={events.length > 3}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ type: "fraction" }}
        modules={[Navigation, Pagination, Autoplay]}
        className={styles.eventSwiper}
      >
        {events.map((event) => (
          <SwiperSlide key={event.id} className={styles.eventSlide}>
            <div className={styles.imageWrapper}>
              <ImageLoader
                imagePath={event.image}
                alt={event.title}
                className={styles.eventImage}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ✅ 커스텀 네비게이션 버튼 (이미지와 겹치도록 배치) */}
      <button
        className={`custom-prev ${styles.navButton} ${styles.prevButton}`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        className={`custom-next ${styles.navButton} ${styles.nextButton}`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default EventSwiper;

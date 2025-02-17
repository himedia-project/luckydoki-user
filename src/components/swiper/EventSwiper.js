import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "../../styles/EventSwiper.module.css";

const EventSwiper = ({ events }) => {
  const [textColors, setTextColors] = useState({});

  useEffect(() => {
    if (!events || events.length === 0) return;

    const getTextColor = (imgSrc, id) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imgSrc;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, img.width, img.height);

          const pixelData = ctx.getImageData(
            img.width / 2,
            img.height / 2,
            1,
            1
          ).data;
          const color = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);

          resolve({ id, color });
        };
      });
    };

    const updateTextColors = async () => {
      const colorPromises = events.map((event) =>
        getTextColor(event.image, event.id)
      );
      const results = await Promise.all(colorPromises);

      const newColors = results.reduce((acc, { id, color }) => {
        acc[id] = color;
        return acc;
      }, {});

      setTextColors(newColors);
    };

    updateTextColors();
  }, [events]);

  const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };

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
        pagination={{ type: "fraction" }}
        modules={[Navigation, Pagination]}
        className={styles.eventSwiper}
      >
        {events.map((event) => (
          <SwiperSlide key={event.id} className={styles.eventSlide}>
            <div className={styles.imageWrapper}>
              <img
                src={event.image}
                alt={event.title}
                className={styles.eventImage}
              />
              <div
                className={styles.imageTitle}
                style={{ color: textColors[event.id] || "white" }}
              >
                {event.title}
              </div>
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

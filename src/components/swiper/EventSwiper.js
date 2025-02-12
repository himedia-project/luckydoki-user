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

          // 중앙 부분 색상 추출
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
    <Swiper
      spaceBetween={20}
      centeredSlides={true}
      slidesPerView={"auto"}
      loop={true}
      navigation
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
              style={{ color: textColors[event.id] || "white" }} // 색상 적용
            >
              {event.title}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default EventSwiper;

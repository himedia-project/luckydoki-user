import React, { useState, useEffect } from "react";
import style from "../../styles/TopButton.module.css";

export default function TopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`${style.top_box} ${isVisible ? style.visible : style.hidden}`}
      onClick={handleScrollToTop}
    >
      <div className={style.top_button}></div>
    </div>
  );
}

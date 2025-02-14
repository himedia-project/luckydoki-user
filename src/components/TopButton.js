import React from "react";
import style from "../styles/TopButton.module.css";

export default function TopButton() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={style.top_box} onClick={handleScrollToTop}>
      <div className={style.top_button}></div>
    </div>
  );
}

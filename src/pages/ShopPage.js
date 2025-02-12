import React, { useState } from "react";
import style from "../styles/ShopPage.module.css";

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("판매상품");

  return (
    <div>
      <div className={style.shop_top}>
        <div className={style.shop_info}>
          <div className={style.seller_info}>
            <img src="https://placehold.co/100" alt="" />
            <p>샵 이름</p>
          </div>
          <p>
            샵 소개샵 소개샵 소개샵 소개샵 소개샵 소개샵 소개샵 소개샵 소개샵
            소개샵 소개샵 소개샵 소개샵 소개샵 소개샵 소개샵 소개샵 소개샵
            소개샵 소개샵 소개샵 소개샵 소개샵 소개샵 소개샵 소개샵 소개
          </p>
          <div className={style.wish_button}>
            <span>+</span>
            <p>찜</p>
          </div>
        </div>
      </div>
      <div className={style.shop_nav}>
        <p
          className={`${style.nav_button} ${
            activeTab === "커뮤니티" ? style.active : ""
          }`}
          onClick={() => setActiveTab("커뮤니티")}
        >
          커뮤니티
        </p>
        <p
          className={`${style.nav_button} ${
            activeTab === "판매상품" ? style.active : ""
          }`}
          onClick={() => setActiveTab("판매상품")}
        >
          판매상품
        </p>
      </div>
    </div>
  );
}

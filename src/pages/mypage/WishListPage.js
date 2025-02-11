import React, { useState } from "react";
import style from "../../styles/WishList.module.css";

export default function WishListPage() {
  const [selectedTab, setSelectedTab] = useState("product");
  return (
    <div className={style.wish_container}>
      <h2>찜목록</h2>
      <div className={style.tab_container}>
        <button
          className={selectedTab === "product" ? style.activeTab : style.tab}
          onClick={() => setSelectedTab("product")}
        >
          상품
        </button>
        <button
          className={selectedTab === "shop" ? style.activeTab : style.tab}
          onClick={() => setSelectedTab("shop")}
        >
          샵
        </button>
      </div>
      <div className={style.content_box}>
        <p>
          {selectedTab === "product"
            ? "찜한 상품이 없습니다."
            : "찜한 샵이 없습니다."}
        </p>
      </div>
    </div>
  );
}

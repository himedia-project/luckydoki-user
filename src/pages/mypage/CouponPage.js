import React, { useState } from "react";
import style from "../../styles/CouponPage.module.css";

export default function CouponPage() {
  const [selectedTab, setSelectedTab] = useState("product");
  return (
    <div className={style.coupon_container}>
      <h2>쿠폰</h2>
      <div className={style.tab_container}>
        <button
          className={selectedTab === "product" ? style.activeTab : style.tab}
          onClick={() => setSelectedTab("product")}
        >
          보유
        </button>
        <button
          className={selectedTab === "shop" ? style.activeTab : style.tab}
          onClick={() => setSelectedTab("shop")}
        >
          만료
        </button>
      </div>
      <div className={style.content_box}>
        <p>
          {selectedTab === "product"
            ? "쿠폰이 없습니다."
            : "만료된 쿠폰이 없습니다."}
        </p>
      </div>
    </div>
  );
}

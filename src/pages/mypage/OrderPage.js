import React from "react";
import style from "../../styles/OrderPage.module.css";

export default function OrderPage() {
  return (
    <div className={style.order_container}>
      <h2>주문 내역</h2>
      <div className={style.content_box}>
        <p>주문하신 내역이 없습니다.</p>
      </div>
    </div>
  );
}

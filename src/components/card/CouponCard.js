import React from "react";
import style from "../../styles/CouponCard.module.css";

export default function CouponCard({ coupon }) {
  return (
    <div className={style.coupon_card}>
      <h3 className={style.coupon_title}>{coupon.name}</h3>
      <p className={style.discount_price}>
        {coupon.discountPrice.toLocaleString()}원
      </p>
      <p className={style.minimum}>
        최소주문금액: {coupon.minimumUsageAmount.toLocaleString()}원
      </p>
      <p className={style.date}>
        {coupon.status === "ISSUED" ? "사용 가능" : "만료됨"} |{" "}
        {coupon.startDate} ~ {coupon.endDate}
      </p>
    </div>
  );
}

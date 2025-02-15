import React, { useEffect, useState } from "react";
import style from "../../styles/CouponPage.module.css";
import { getCoupons } from "../../api/couponApi";
import CouponCard from "../../components/card/CouponCard";

export default function CouponPage() {
  const [coupons, setCoupons] = useState([]);
  const [selectedTab, setSelectedTab] = useState("ISSUED");

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getCoupons();
        setCoupons(response.data);
      } catch (error) {
        console.error("쿠폰 목록 가져오기 실패:", error);
      }
    };

    fetchCoupons();
  }, []);

  const issuedCoupons = coupons.filter((coupon) => coupon.status === "ISSUED");
  const expiredCoupons = coupons.filter(
    (coupon) => coupon.status === "EXPIRED"
  );

  return (
    <div className={style.coupon_container}>
      <h2>쿠폰</h2>

      <div className={style.tab_container}>
        <button
          className={selectedTab === "ISSUED" ? style.activeTab : style.tab}
          onClick={() => setSelectedTab("ISSUED")}
        >
          보유
        </button>
        <button
          className={selectedTab === "EXPIRED" ? style.activeTab : style.tab}
          onClick={() => setSelectedTab("EXPIRED")}
        >
          만료
        </button>
      </div>

      <div className={style.content_box}>
        {selectedTab === "ISSUED" ? (
          issuedCoupons.length > 0 ? (
            issuedCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))
          ) : (
            <p>쿠폰이 없습니다.</p>
          )
        ) : expiredCoupons.length > 0 ? (
          expiredCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))
        ) : (
          <p>만료된 쿠폰이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import style from "../../styles/CouponPage.module.css";
import { getCoupons, registerCoupon } from "../../api/couponApi";
import CouponCard from "../../components/card/CouponCard";

export default function CouponPage() {
  const [coupons, setCoupons] = useState([]);
  const [selectedTab, setSelectedTab] = useState("ISSUED");
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

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

  const handleRegisterCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      setMessage({ text: "쿠폰 코드를 입력해주세요", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await registerCoupon(couponCode);
      setCoupons([...coupons, response.data]);
      setMessage({ text: "쿠폰이 성공적으로 등록되었습니다", type: "success" });
      setCouponCode("");
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "쿠폰 등록에 실패했습니다",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const issuedCoupons = coupons.filter((coupon) => coupon.status === "ISSUED");
  const expiredCoupons = coupons.filter(
    (coupon) => coupon.status === "EXPIRED"
  );

  return (
    <div className={style.coupon_container}>
      <h2>쿠폰</h2>

      <div className={style.coupon_register}>
        <form onSubmit={handleRegisterCoupon}>
          <div className={style.input_group}>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="쿠폰 코드 입력"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={style.register_btn}
            >
              {isLoading ? "등록 중" : "등록"}
            </button>
          </div>
          {message.text && (
            <p className={`${style.message} ${style[message.type]}`}>
              {message.text}
            </p>
          )}
        </form>
      </div>

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

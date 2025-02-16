import React, { useState } from "react";
import { useSelector } from "react-redux";
import style from "../../styles/PaymentPage.module.css";
import ImageLoader from "../../components/card/ImageLoader";
import { getCoupons } from "../../api/couponApi";

const PaymentPage = () => {
  const cartState = useSelector((state) => state.cartSlice);
  const { cartItems } = cartState || { cartItems: [] };

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const calculateItemTotal = (item) => {
    return item.discountPrice * item.qty;
  };

  const calculateTotalAmount = () => {
    return cartItems.reduce(
      (total, item) => total + calculateItemTotal(item),
      0
    );
  };

  const handleCouponClick = async () => {
    try {
      const response = await getCoupons();
      setCoupons(response.data);
      setShowCouponModal(true);
    } catch (error) {
      console.error("쿠폰 목록 조회 실패:", error);
    }
  };

  const handleCouponSelect = (coupon) => {
    const totalAmount = calculateTotalAmount();
    if (totalAmount < coupon.minimumUsageAmount) {
      alert(
        `최소 주문금액 ${coupon.minimumUsageAmount.toLocaleString()}원 이상일 때 사용 가능한 쿠폰입니다.`
      );
      return;
    }
    setSelectedCoupon(coupon);
    setShowCouponModal(false);
  };

  const calculateDiscountAmount = () => {
    if (!selectedCoupon) return 0;
    return selectedCoupon.discountPrice;
  };

  const calculateFinalAmount = () => {
    return calculateTotalAmount() - calculateDiscountAmount();
  };

  return (
    <div className={style.payment_container}>
      <div className={style.payment_header}>
        <h2>주문하기</h2>
        <div className={style.payment_steps}>
          <span>01 장바구니</span>
          <span className={style.active}>02 주문 결제</span>
          <span>03 주문 완료</span>
        </div>
      </div>
      <div className={style.payment_content}>
        <div className={style.payment_items}>
          <div className={style.payment_section}>
            <h3>주문 상품 정보</h3>
            {cartItems.map((item) => (
              <div key={item.cartItemId} className={style.order_item}>
                <ImageLoader
                  imagePath={item.imageName}
                  alt={item.productName}
                  className={style.product_image}
                />
                <div className={style.product_info}>
                  <h4>{item.productName}</h4>
                  <div className={style.price_info}>
                    <div className={style.unit_price}>
                      <span className={style.price_label}>상품 단가</span>
                      <span className={style.discount_price}>
                        {item.discountPrice.toLocaleString()}원
                      </span>
                    </div>
                    <div className={style.total_price}>
                      <span className={style.price_label}>총 상품금액</span>
                      <span className={style.discount_price}>
                        {calculateItemTotal(item).toLocaleString()}원
                      </span>
                      <span className={style.quantity}>
                        (수량: {item.qty}개)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={style.payment_section}>
            <h3>결제 수단</h3>
            <div className={style.payment_methods}>
              <button className={style.method_btn}>신용, 체크카드</button>
              <button className={style.method_btn}>계좌이체/무통장입금</button>
              <button className={style.method_btn}>휴대폰 결제</button>
            </div>
          </div>

          <div className={style.payment_section}>
            <h3>쿠폰 적용</h3>
            <div className={style.coupon_section}>
              <button className={style.coupon_btn} onClick={handleCouponClick}>
                쿠폰 선택하기
              </button>
              {selectedCoupon && (
                <div className={style.selected_coupon}>
                  선택된 쿠폰: {selectedCoupon.name}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={style.payment_summary}>
          <h3>주문 예상 금액</h3>
          <div className={style.summary_row}>
            <span>상품금액</span>
            <span>{calculateTotalAmount().toLocaleString()}원</span>
          </div>
          <div className={style.summary_row}>
            <span>쿠폰 할인</span>
            <span>-{calculateDiscountAmount().toLocaleString()}원</span>
          </div>
          <div className={style.total}>
            <span>총 결제금액</span>
            <span>{calculateFinalAmount().toLocaleString()}원</span>
          </div>
          <div className={style.agreement_section}>
            <label className={style.checkbox_label}>
              <input type="checkbox" />
              <span>아래 내용을 모두 동의합니다.</span>
            </label>
            <div className={style.agreement_items}>
              <label>
                <input type="checkbox" />
                <span>(필수) 만 14세 이상입니다.</span>
              </label>
              <label>
                <input type="checkbox" />
                <span>(필수) 개인정보 수집/이용동의</span>
              </label>
              <label>
                <input type="checkbox" />
                <span>(필수) 개인정보 제3자 위탁동의</span>
              </label>
            </div>
          </div>
          <button className={style.payment_btn}>결제하기</button>
        </div>
      </div>

      {showCouponModal && (
        <div className={style.modal_overlay}>
          <div className={style.modal_content}>
            <div className={style.modal_header}>
              <h3>사용 가능한 쿠폰</h3>
              <button
                className={style.close_btn}
                onClick={() => setShowCouponModal(false)}
              >
                ✕
              </button>
            </div>
            <div className={style.coupon_list}>
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={style.coupon_item}
                  onClick={() => handleCouponSelect(coupon)}
                >
                  <div className={style.coupon_info}>
                    <h4>{coupon.name}</h4>
                    <p>{coupon.content}</p>
                    <span className={style.coupon_condition}>
                      {coupon.minimumUsageAmount.toLocaleString()}원 이상 구매시
                    </span>
                    <span className={style.coupon_period}>
                      {coupon.startDate} ~ {coupon.endDate}
                    </span>
                  </div>
                  <div className={style.coupon_value}>
                    {coupon.discountPrice.toLocaleString()}원
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;

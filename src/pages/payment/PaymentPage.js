import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import style from "../../styles/PaymentPage.module.css";
import ImageLoader from "../../components/card/ImageLoader";
import { getCoupons } from "../../api/couponApi";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { paymentApi } from "../../api/paymentApi";
import { order, getOrderList } from "../../api/orderApi";

const PaymentPage = () => {
  const location = useLocation();
  const { selectedProducts, totalAmount } = location.state || {
    selectedProducts: [],
    totalAmount: 0,
  };

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [agreements, setAgreements] = useState({
    all: false,
    age: false,
    privacy: false,
    thirdParty: false,
  });
  const [paymentMethod, setPaymentMethod] = useState("");

  const calculateItemTotal = (item) => {
    return item.discountPrice * item.qty;
  };

  const calculateTotalAmount = () => {
    return selectedProducts.reduce(
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

  const handleAllAgreements = (e) => {
    const { checked } = e.target;
    setAgreements({
      all: checked,
      age: checked,
      privacy: checked,
      thirdParty: checked,
    });
  };

  const handleSingleAgreement = (e) => {
    const { name, checked } = e.target;
    const newAgreements = {
      ...agreements,
      [name]: checked,
    };

    // 모든 항목이 체크되었는지 확인
    const allChecked = Object.keys(newAgreements)
      .filter((key) => key !== "all")
      .every((key) => newAgreements[key]);

    setAgreements({
      ...newAgreements,
      all: allChecked,
    });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handlePaymentClick = async () => {
    if (!agreements.age || !agreements.privacy || !agreements.thirdParty) {
      alert("모든 필수 항목에 동의해주세요.");
      return;
    }

    if (!paymentMethod) {
      alert("결제 방법을 선택해주세요.");
      return;
    }

    try {
      // 주문 정보 생성
      const orderData = {
        couponId: selectedCoupon?.id,
        cartItems: selectedProducts.map((item) => ({
          productId: item.productId,
          count: item.qty,
        })),
      };

      // 주문 생성
      await order(orderData);

      // 주문 목록 조회하여 최신 주문 정보 가져오기
      const orderListResponse = await getOrderList();
      const latestOrder = orderListResponse.data[0]; // 가장 최근 주문

      const tossPayments = await loadTossPayments(
        // process.env.REACT_APP_TOSS_CLIENT_KEY
        "test_ck_OyL0qZ4G1VO4mYmDbvnroWb2MQYg"
      );

      // 결제 준비
      await paymentApi.preparePayment({
        orderId: latestOrder.orderCode,
        amount: calculateFinalAmount(),
      });

      // 결제 금액 검증
      await paymentApi.validatePayment(
        latestOrder.orderCode,
        calculateFinalAmount()
      );

      // 결제 요청
      await tossPayments.requestPayment(
        paymentMethod === "신용, 체크카드"
          ? "CARD"
          : paymentMethod === "계좌이체/무통장입금"
          ? "VIRTUAL_ACCOUNT"
          : "PHONE",
        {
          amount: calculateFinalAmount(),
          orderId: latestOrder.orderCode,
          orderName:
            latestOrder.orderItems.length > 1
              ? `${latestOrder.orderItems[0].productName} 외 ${
                  latestOrder.orderItems.length - 1
                }건`
              : latestOrder.orderItems[0].productName,
          customerName: latestOrder.email.split("@")[0],
          successUrl: `${window.location.origin}/payment/success`,
          failUrl: `${window.location.origin}/payment/fail`,
        }
      );
    } catch (error) {
      console.error("결제 요청 실패:", error);
      alert("결제 요청이 실패했습니다. 다시 시도해주세요.");
    }
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
            <div className={style.section_header}>
              <h3>주문 상품 정보</h3>
              <button className={style.coupon_btn} onClick={handleCouponClick}>
                쿠폰사용
              </button>
            </div>
            {selectedProducts.map((item) => (
              <div key={item.cartItemId} className={style.order_item}>
                <div className={style.item_main_info}>
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
              </div>
            ))}
            {selectedCoupon && (
              <div className={style.selected_coupon_info}>
                <span>{selectedCoupon.name}</span>
                <span className={style.coupon_discount}>
                  -{selectedCoupon.discountPrice.toLocaleString()}원
                </span>
              </div>
            )}
          </div>

          <div className={style.payment_section}>
            <h3>결제 수단</h3>
            <div className={style.payment_methods}>
              <button
                className={`${style.method_btn} ${
                  paymentMethod === "신용, 체크카드" ? style.active : ""
                }`}
                onClick={() => handlePaymentMethodChange("신용, 체크카드")}
              >
                신용, 체크카드
              </button>
              <button
                className={`${style.method_btn} ${
                  paymentMethod === "계좌이체/무통장입금" ? style.active : ""
                }`}
                onClick={() => handlePaymentMethodChange("계좌이체/무통장입금")}
              >
                계좌이체/무통장입금
              </button>
              <button
                className={`${style.method_btn} ${
                  paymentMethod === "휴대폰 결제" ? style.active : ""
                }`}
                onClick={() => handlePaymentMethodChange("휴대폰 결제")}
              >
                휴대폰 결제
              </button>
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
              <input
                type="checkbox"
                checked={agreements.all}
                onChange={handleAllAgreements}
              />
              <span>아래 내용을 모두 동의합니다.</span>
            </label>
            <div className={style.agreement_items}>
              <label>
                <input
                  type="checkbox"
                  name="age"
                  checked={agreements.age}
                  onChange={handleSingleAgreement}
                />
                <span>(필수) 만 14세 이상입니다.</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="privacy"
                  checked={agreements.privacy}
                  onChange={handleSingleAgreement}
                />
                <span>(필수) 개인정보 수집/이용동의</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="thirdParty"
                  checked={agreements.thirdParty}
                  onChange={handleSingleAgreement}
                />
                <span>(필수) 개인정보 제3자 위탁동의</span>
              </label>
            </div>
          </div>
          <button className={style.payment_btn} onClick={handlePaymentClick}>
            결제하기
          </button>
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

import React from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { paymentApi } from "../../api/paymentApi";
import style from "../../styles/PaymentFailPage.module.css";

const PaymentFailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const message =
    location.state?.message ||
    searchParams.get("message") ||
    "알 수 없는 오류가 발생했습니다.";

  const handlePaymentCancel = async () => {
    try {
      const orderId = searchParams.get("orderId"); // 이는 orderCode입니다
      if (!orderId) {
        throw new Error("주문 정보가 없습니다.");
      }

      await paymentApi.cancelPayment(orderId, "사용자 결제 취소");
      alert("결제가 취소되었습니다.");
      navigate("/cart", { replace: true });
    } catch (error) {
      console.error("결제 취소 실패:", error);
      alert("결제 취소에 실패했습니다: " + error.message);
    }
  };

  return (
    <div className={style.payment_fail_container}>
      <div className={style.fail_content}>
        <div className={style.fail_icon}>✕</div>
        <h1>결제 실패</h1>
        <p>결제 중 문제가 발생했습니다.</p>
        <p className={style.error_message}>에러 메시지: {message}</p>
        <div className={style.button_group}>
          <button onClick={handlePaymentCancel} className={style.cancel_button}>
            결제 취소
          </button>
          <button
            onClick={() => navigate("/cart")}
            className={style.back_button}
          >
            장바구니로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailPage;

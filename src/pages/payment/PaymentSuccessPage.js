import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { paymentApi } from "../../api/paymentApi";
import confetti from "canvas-confetti";
import style from "../../styles/PaymentSuccessPage.module.css";
import { useDispatch } from "react-redux";

import { setCartItems } from "../../api/redux/cartSlice";
import { getCartItemList } from "../../api/cartApi";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const confirmComplete = useRef(false);

  // 페이지 로드 시 즉시 폭죽 효과 실행
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  // 결제 확인 및 폭죽 효과
  useEffect(() => {
    const confirmPayment = async () => {
      if (confirmComplete.current) return;

      try {
        const paymentKey = searchParams.get("paymentKey");
        const orderId = searchParams.get("orderId"); // 이는 orderCode입니다
        const amount = searchParams.get("amount");

        if (!paymentKey || !orderId || !amount) {
          throw new Error("필수 결제 정보가 누락되었습니다.");
        }

        // 결제 승인 요청
        confirmComplete.current = true;
        await paymentApi.confirmPayment(paymentKey, orderId, parseInt(amount));

        // 장바구니 정보 새로 불러오기
        const cartItems = await getCartItemList();
        dispatch(setCartItems(cartItems));

        // 성공적으로 결제가 완료되면 추가 폭죽 효과
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (error) {
        console.error("결제 승인 실패:", error);
        confirmComplete.current = false;
        navigate("/payment/fail", {
          state: {
            orderId: searchParams.get("orderId"),
            message: error.response?.data?.message || error.message,
          },
        });
      }
    };

    confirmPayment();
  }, [searchParams, navigate, dispatch]);

  useEffect(() => {
    // 결제 성공 페이지에서는 beforeunload 경고 방지
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className={style.complete_container}>
      <div className={style.complete_content}>
        <div className={style.check_circle}>
          <div className={style.check_icon}>✓</div>
        </div>
        <h2 className={style.complete_title}>결제가 완료되었습니다</h2>
        <button
          className={style.confirm_button}
          onClick={() => navigate("/", { replace: true })}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

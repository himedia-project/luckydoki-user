import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { paymentApi } from "../../api/paymentApi";
import confetti from "canvas-confetti";
import style from "../../styles/PaymentSuccessPage.module.css";
import { setCartItems } from "../../api/redux/cartSlice";
import { getCartItemList } from "../../api/cartApi";
import Swal from "sweetalert2";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const confirmComplete = useRef(false);

  // 로그인 상태 확인
  const { email, accessToken } = useSelector((state) => state.loginSlice);

  // 인증 상태 체크
  useEffect(() => {
    if (!email || !accessToken) {
      Swal.fire({
        title: "로그인이 필요합니다",
        text: "로그인 페이지로 이동합니다.",
        icon: "warning",
        confirmButtonText: "확인",
      }).then(() => {
        navigate("/login");
      });
      return;
    }
  }, [email, accessToken, navigate]);

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
      if (confirmComplete.current || !email) return;

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

        try {
          // 장바구니 정보 새로 불러오기
          const cartResponse = await getCartItemList();
          dispatch(setCartItems(cartResponse));

          // // 성공적으로 결제가 완료되면 추가 폭죽 효과
          // confetti({
          //   particleCount: 100,
          //   spread: 70,
          //   origin: { y: 0.6 },
          // });
        } catch (error) {
          console.error("장바구니 정보 업데이트 실패:", error);
          // 장바구니 업데이트 실패는 크리티컬한 에러가 아니므로 사용자에게 알리지 않음
        }
      } catch (error) {
        console.error("결제 승인 실패:", error);
        confirmComplete.current = false;

        Swal.fire({
          title: "결제 승인 실패",
          text:
            error.response?.data?.message ||
            "결제 처리 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        }).then(() => {
          navigate("/payment/fail", {
            state: {
              orderId: searchParams.get("orderId"),
              message: error.response?.data?.message || error.message,
            },
          });
        });
      }
    };

    confirmPayment();
  }, [searchParams, navigate, dispatch, email]);

  // 페이지 이탈 방지
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!confirmComplete.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    // 브라우저 뒤로가기 방지
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleConfirm = () => {
    if (confirmComplete.current) {
      navigate("/", { replace: true });
    } else {
      Swal.fire({
        title: "결제 처리 중",
        text: "결제 확인이 완료될 때까지 기다려주세요.",
        icon: "info",
        confirmButtonText: "확인",
      });
    }
  };

  return (
    <div className={style.complete_container}>
      <div className={style.complete_content}>
        <div className={style.check_circle}>
          <div className={style.check_icon}>✓</div>
        </div>
        <h2 className={style.complete_title}>결제가 완료되었습니다</h2>
        <button className={style.confirm_button} onClick={handleConfirm}>
          확인
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

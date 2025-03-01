import React, { useState } from "react";
import styles from "../styles/LoginPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import { getKakaoLoginLink } from "../api/kakaoApi";
import { useDispatch } from "react-redux";
import { login } from "../api/redux/loginSlice";
import { setCartEmail } from "../api/redux/cartSlice";
import { setNotificationEmail } from "../api/redux/notificationSlice";
import { loginPost } from "../api/loginApi";
import { clearCartItems } from "../api/redux/cartSlice";
import { clearNotificationItems } from "../api/redux/notificationSlice";
import { getCartItemList } from "../api/cartApi";
import {
  getMessageNotificationList,
  getNotificationList,
} from "../api/notificationApi";
import { setCartItems } from "../api/redux/cartSlice";
import { setNotificationItems } from "../api/redux/notificationSlice";
import {
  clearMessageItems,
  setMessageEmail,
  setMessageItems,
} from "../api/redux/messageSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(""); // 입력 시 에러 메시지 초기화
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleKakaoLogin = () => {
    const link = getKakaoLoginLink();
    window.location.href = link;
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=email profile";
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      setErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await loginPost(loginForm.email, loginForm.password);
      const { email } = response.data;

      // 먼저 이전 데이터 초기화
      dispatch(clearCartItems());
      dispatch(clearNotificationItems());
      dispatch(clearMessageItems());

      // 로그인 처리
      dispatch(login(response.data));

      // 새로운 사용자의 이메일로 상태 업데이트
      dispatch(setCartEmail(email));
      dispatch(setNotificationEmail(email));
      dispatch(setMessageEmail(email));

      // 해당 사용자의 데이터 가져오기
      try {
        const cartResponse = await getCartItemList();
        dispatch(setCartItems(cartResponse));

        const notificationResponse = await getNotificationList();
        dispatch(setNotificationItems(notificationResponse));

        const messageResponse = await getMessageNotificationList();
        dispatch(setMessageItems(messageResponse));
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }

      navigate("/");
      setTimeout(() => {
        document.body.style.pointerEvents = "auto";
      }, 100);
    } catch (error) {
      setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.homeButton} onClick={handleHomeClick}>
        <img src="home.png" alt="홈버튼" />
      </button>
      <h1 className={styles.title}>로그인</h1>
      <button className={styles.kakaoButton} onClick={handleKakaoLogin}>
        <span className={styles.icon}>
          <img src="kakao_icon.png" alt="카카오 로고" />
        </span>
        카카오 로그인
      </button>
      <button className={styles.googleButton} onClick={handleGoogleLogin}>
        <span className={styles.icon}>
          <img src="google_icon.png" alt="구글 로고" />
        </span>
        구글 로그인
      </button>
      <hr className={styles.divider} />
      {!showEmailForm ? (
        <button
          className={styles.emailButton}
          onClick={() => setShowEmailForm(!showEmailForm)}
        >
          Email로 로그인
        </button>
      ) : (
        <div
          className={`${styles.emailForm} ${
            showEmailForm ? styles.active : ""
          }`}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginForm.email}
            className={styles.inputField}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginForm.password}
            className={styles.inputField}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            required
          />
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
          <button className={styles.loginSubmitButton} onClick={handleLogin}>
            로그인
          </button>
          <div className={styles.links}>
            <Link to="/find-email">이메일 찾기</Link>
            <Link to="/find-password">비밀번호 찾기</Link>
            <Link to="/join">이메일 가입</Link>
          </div>
          <button
            className={styles.closeButton}
            onClick={() => setShowEmailForm(false)}
          >
            닫기
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

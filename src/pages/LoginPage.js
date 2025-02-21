import React, { useState } from "react";
import styles from "../styles/LoginPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import { getKakaoLoginLink } from "../api/kakaoApi";
import axios from "axios"; // ✅ 기본 axios 사용
import { useDispatch } from "react-redux";
import { login, setAccessToken } from "../api/redux/loginSlice";
import Cookies from "js-cookie";
import { API_URL } from "../config/apiConfig"; // ✅ API 경로 사용
import { setCartEmail } from "../api/redux/cartSlice";
import { setNotificationEmail } from "../api/redux/notificationSlice";

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

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/member/login`,
        loginForm,
        {
          withCredentials: true, // ✅ 쿠키 포함 요청
        }
      );

      const { accessToken, refreshToken, roles } = response.data;

      // Cookies.set("refresh_token", refreshToken, { expires: 7, secure: true });
      // dispatch(setAccessToken(accessToken));
      dispatch(login(response.data));
      dispatch(setCartEmail(response.data.email));
      dispatch(setNotificationEmail(response.data.email));
      const isAdmin = roles.includes("ADMIN");
      navigate(isAdmin ? "/admin" : "/");
    } catch (error) {
      setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className={styles.container}>
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

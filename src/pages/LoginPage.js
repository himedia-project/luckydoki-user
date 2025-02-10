import React, { useState } from "react";
import styles from "../styles/LoginPage.module.css";
import { Link } from "react-router-dom";
import { getKakaoLoginLink } from "../api/kakaoApi";

const LoginPage = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKakaoLogin = () => {
    window.location.href = getKakaoLoginLink();
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=email profile";
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
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginForm.password}
            className={styles.inputField}
            onChange={handleChange}
            required
          />
          <button className={styles.loginSubmitButton}>LOGIN</button>
          <div className={styles.links}>
            <Link to="/find-email">이메일 찾기</Link>
            <Link to="/find-password">비밀번호 찾기</Link>
            <Link to="/register">이메일 가입</Link>
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

import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_URL } from "../config/apiConfig";
import styles from "../styles/RegisterPage.module.css";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    nickName: "",
    phone: "",
    verificationCode: "",
  });
  const [isVerified, setIsVerified] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [timer, setTimer] = useState(300);
  const [timerActive, setTimerActive] = useState(false);
  const navigate = useNavigate();

  const REQUIRED_TEXT = <span className={styles.requiredText}>(필수)</span>;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      let formattedValue = value.replace(/[^0-9]/g, "");
      if (formattedValue.length > 3 && formattedValue.length <= 7) {
        formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(
          3
        )}`;
      } else if (formattedValue.length > 7) {
        formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(
          3,
          7
        )}-${formattedValue.slice(7, 11)}`;
      }
      setSignupForm((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
      return;
    }

    setSignupForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendVerificationCode = async () => {
    try {
      await axios.post(
        `${API_URL}/api/phone/send`,
        {
          phone: signupForm.phone,
        },
        { withCredentials: true }
      );
      setTimer(300);
      setTimerActive(true);
      setShowVerification(true);
      Swal.fire(
        "인증번호 전송",
        "입력한 번호로 인증번호가 발송되었습니다.",
        "success"
      );
    } catch (error) {
      Swal.fire("오류", "인증번호 전송에 실패했습니다.", "error");
    }
  };

  const handleVerifyCode = async () => {
    try {
      await axios.post(
        `${API_URL}/api/phone/verify`,
        {
          phone: signupForm.phone,
          code: signupForm.verificationCode,
        },
        { withCredentials: true }
      );
      setIsVerified(true);
      setTimerActive(false);
      Swal.fire("인증 성공", "전화번호 인증이 완료되었습니다.", "success");
    } catch (error) {
      Swal.fire("오류", "인증번호가 올바르지 않습니다.", "error");
    }
  };

  const handleSignup = async () => {
    if (signupForm.password !== signupForm.confirmPassword) {
      Swal.fire("오류", "비밀번호가 일치하지 않습니다.", "error");
      return;
    }
    if (!isVerified) {
      Swal.fire("오류", "전화번호 인증을 완료해주세요.", "error");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/member/join`, {
        email: signupForm.email,
        nickName: signupForm.nickName,
        password: signupForm.password,
        phone: signupForm.phone,
        verificationCode: signupForm.verificationCode,
      });
      Swal.fire("회원가입 성공", "회원가입이 완료되었습니다.", "success");
      window.history.back();
    } catch (error) {
      Swal.fire("오류", "회원가입에 실패했습니다.", "error");
    }
  };

  useEffect(() => {
    let interval = null;
    if (showVerification && timerActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showVerification, timerActive]);

  useEffect(() => {
    if (timer <= 0 && showVerification && !isVerified) {
      Swal.fire(
        "알림",
        "인증번호가 만료되었습니다. 인증번호를 재전송합니다.",
        "info"
      );
      handleSendVerificationCode();
    }
  }, [timer, showVerification, isVerified]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };
  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <button className={styles.homeButton} onClick={handleHomeClick}>
        <img src="home.png" alt="홈버튼" />
      </button>
      <h1 className={styles.title}>회원가입</h1>
      <div className={styles.inputGroup}>
        <label className={styles.label}>이메일 {REQUIRED_TEXT}</label>
        <input
          type="email"
          name="email"
          placeholder="abcde@abcde.com"
          value={signupForm.email}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>비밀번호 {REQUIRED_TEXT}</label>
        <input
          type="password"
          name="password"
          placeholder="password"
          value={signupForm.password}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>비밀번호 확인 {REQUIRED_TEXT}</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="password 재입력"
          value={signupForm.confirmPassword}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>닉네임 {REQUIRED_TEXT}</label>
        <input
          type="text"
          name="nickName"
          placeholder="홍길동"
          value={signupForm.nickName}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
      </div>
      <div className={styles.phoneGroup}>
        <label className={styles.label}>전화번호 {REQUIRED_TEXT}</label>
        <div className={styles.phoneInputGroup}>
          <input
            type="text"
            name="phone"
            placeholder="전화번호 (- 포함)"
            value={signupForm.phone}
            onChange={handleChange}
            className={styles.inputField}
            required
            disabled={isVerified}
          />
          <button
            onClick={handleSendVerificationCode}
            className={styles.verifyButton}
            disabled={isVerified}
          >
            인증요청
          </button>
        </div>
      </div>
      {showVerification && (
        <div className={styles.verifiGroup}>
          <input
            type="text"
            name="verificationCode"
            placeholder="인증번호 입력"
            value={signupForm.verificationCode}
            onChange={handleChange}
            className={styles.inputField}
            required
            disabled={isVerified}
          />
          <button
            onClick={handleVerifyCode}
            className={`${styles.verifyButton} ${
              isVerified ? styles.verifiedButton : ""
            }`}
            disabled={isVerified}
          >
            {isVerified ? "인증완료" : "인증"}
          </button>
          <p className={styles.timerText}>{formatTime(timer)}</p>
        </div>
      )}
      <button onClick={handleSignup} className={styles.signupButton}>
        계정 만들기
      </button>
    </div>
  );
};

export default RegisterPage;

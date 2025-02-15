import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { logoutPost } from "../api/loginApi";
import { logout } from "../api/redux/loginSlice";
import style from "../styles/Header.module.css";
import NotificationDropdown from "../components/dropdown/NotificationDropdown";
import MessageDropdown from "../components/dropdown/MessageDropdown";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { nickName } = useSelector((state) => state.loginSlice);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showHeaderTop, setShowHeaderTop] = useState(false);

  const notifications = [
    { category: "이벤트", message: "[0000원 쿠폰] 도착", date: "2월 11일" },
    {
      category: "이벤트",
      message: "[할인 혜택] 10% 쿠폰 지급",
      date: "2월 10일",
    },
    { category: "이벤트", message: "[0000원 쿠폰] 도착", date: "2월 11일" },
    {
      category: "이벤트",
      message: "[할인 혜택] 10% 쿠폰 지급",
      date: "2월 10일",
    },
    { category: "이벤트", message: "[0000원 쿠폰] 도착", date: "2월 11일" },
    {
      category: "이벤트",
      message: "[할인 혜택] 10% 쿠폰 지급",
      date: "2월 10일",
    },
    { category: "이벤트", message: "[0000원 쿠폰] 도착", date: "2월 11일" },
    {
      category: "이벤트",
      message: "[할인 혜택] 10% 쿠폰 지급",
      date: "2월 10일",
    },
  ];

  const messages = [
    { sender: "샵 이름", content: "대화내용", date: "2월 10일" },
    { sender: "샵 이름", content: "대화내용", date: "2월 10일" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowHeaderTop(window.scrollY <= 99);
      console.log(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutPost();
      dispatch(logout());
      alert("로그아웃 되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다.");
    }
  };

  const handleNeedLoginLink = (e) => {
    if (!nickName) {
      e.preventDefault();
      Swal.fire({
        toast: true,
        position: "top",
        title: "로그인이 필요합니다.",
        icon: "warning",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: false,
      });
    }
  };

  return (
    <div className={style.header}>
      <div className={style.inner}>
        <div
          className={`${style.header_top} ${showHeaderTop ? "" : style.hidden}`}
        >
          <ul className={style.login_nav}>
            {/* 로그인/로그아웃 */}
            {nickName ? (
              <li className={style.logout} onClick={handleLogout}>
                로그아웃
              </li>
            ) : (
              <li>
                <Link to="/login">로그인</Link>
              </li>
            )}

            {/* 알림 */}
            <li
              className={style.notice}
              onMouseEnter={() => setShowNotifications(true)}
              onMouseLeave={() => setShowNotifications(false)}
            >
              <img src="/notification.png" alt="알림" />
              <Link>알림</Link>
              {showNotifications && (
                <NotificationDropdown notifications={notifications} />
              )}
            </li>

            {/* 메시지 */}
            <li
              className={style.message}
              onMouseEnter={() => setShowMessages(true)}
              onMouseLeave={() => setShowMessages(false)}
            >
              <img src="/chat.png" alt="메시지" />
              <Link>메시지</Link>
              {showMessages && <MessageDropdown messages={messages} />}
            </li>
          </ul>
        </div>

        <div className={style.header_middle}>
          {/* 로고 */}
          <Link to="/" className={style.logo}>
            <img src="/logo.png" alt="로고" />
          </Link>

          <ul className={style.icon_container}>
            {/* 검색아이콘 */}
            <li>
              <Link to="/search">
                <img src="/search.png" alt="검색" />
              </Link>
            </li>

            {/* 하트아이콘 */}
            <li>
              <Link to="/likeslist" onClick={handleNeedLoginLink}>
                <img src="/heart.png" alt="좋아요" />
              </Link>
            </li>

            {/* 마이페이지아이콘 */}
            <li>
              <Link to="/mypage" onClick={handleNeedLoginLink}>
                <img src="/mypage.png" alt="마이페이지" />
              </Link>
            </li>

            {/* 카트아이콘 */}
            <li>
              <Link to="/cart" onClick={handleNeedLoginLink}>
                <img src="/cart.png" alt="장바구니" />
              </Link>
            </li>
          </ul>
        </div>

        {/* 카테고리 nav */}
        <div className={style.header_bottom}>
          <ul className={style.category_nav}>
            <li>패션/주얼리</li>
            <li>반려동물</li>
            <li>케이스문구</li>
          </ul>

          <li className={style.bar}></li>

          <ul className={style.subpage_nav}>
            <li>
              <Link to="/popular">인기상품</Link>
            </li>
            <li>
              <Link to="/new">최신상품</Link>
            </li>
            <li>
              <Link to="/community">커뮤니티</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/redux/loginSlice";
import { clearCartItems } from "../api/redux/cartSlice";
import style from "../styles/Header.module.css";
import NotificationDropdown from "../components/dropdown/NotificationDropdown";
import MessageDropdown from "../components/dropdown/MessageDropdown";
import { getMainCategories } from "../api/categoryApi";
import CategoryNav from "../components/CategoryNav";
import Swal from "sweetalert2";
import { useNotification } from "../hooks/useNotification";
import { useFCMToken } from "../hooks/useFCMToken";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email } = useSelector((state) => state.loginSlice);
  const { notifications, clearNotifications } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showHeaderTop, setShowHeaderTop] = useState(true);
  const [mainCategories, setMainCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { cartItems } = useSelector((state) => state.cartSlice);
  const { updateToken } = useFCMToken();

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await getMainCategories();
        setMainCategories(response.data);
      } catch (error) {
        console.error("메인 카테고리 불러오기 실패:", error);
      }
    };
    fetchMainCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowHeaderTop(window.scrollY === 0 || window.scrollY <= 99);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const initializeFCM = async () => {
      if (email) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            await updateToken(email);
          }
        } catch (error) {
          console.error("FCM 초기화 실패:", error);
        }
      }
    };

    initializeFCM();
  }, [email]);

  const handleProtectedRoute = (event, path) => {
    if (!email) {
      event.preventDefault();
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "로그인이 필요합니다.",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      navigate(path);
    }
  };

  const handleMouseEnter = (categoryId) => {
    setActiveCategory(categoryId);
    setIsDropdownVisible(true);
  };

  const handleMouseLeave = (event) => {
    const relatedTarget = event.relatedTarget;

    // ✅ relatedTarget이 존재하지 않는 경우 (빠르게 마우스 이동 시)
    if (!relatedTarget) {
      setIsDropdownVisible(false);
      setActiveCategory(null);
      return;
    }

    if (!(relatedTarget instanceof Element)) {
      setIsDropdownVisible(false);
      setActiveCategory(null);
      return;
    }

    // ✅ 드롭다운 내부로 이동한 경우 상태 유지
    if (
      relatedTarget.closest(`.${style.category_dropdown}`) ||
      relatedTarget.closest(`.${style.category_nav}`)
    ) {
      return;
    }

    // ✅ 드롭다운 영역을 벗어난 경우 닫기
    setIsDropdownVisible(false);
    setActiveCategory(null);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "로그아웃 하시겠습니까?",
      text: "확인을 누르면 홈으로 이동합니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        dispatch(clearCartItems());
        Swal.fire({
          title: "로그아웃되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  return (
    <div className={style.header}>
      <div className={style.inner}>
        <div
          className={`${style.header_top} ${showHeaderTop ? "" : style.hidden}`}
        >
          <ul className={style.login_nav}>
            {email ? (
              <li className={style.logout} onClick={handleLogout}>
                로그아웃
              </li>
            ) : (
              <li>
                <Link to="/login">로그인</Link>
              </li>
            )}
            <li
              className={style.notice}
              onMouseEnter={() => setShowNotifications(true)}
              onMouseLeave={() => setShowNotifications(false)}
            >
              <img src="/notification.png" alt="알림" />
              <Link>
                알림
                {notifications.length > 0 && (
                  <span className={style.notification_count}>
                    {notifications.length}
                  </span>
                )}
              </Link>
              {showNotifications && <NotificationDropdown />}
            </li>
            <li
              className={style.message}
              onMouseEnter={() => setShowMessages(true)}
              onMouseLeave={() => setShowMessages(false)}
            >
              <img src="/chat.png" alt="메시지" />
              <Link>메시지</Link>
              {showMessages && <MessageDropdown messages={[]} />}
            </li>
          </ul>
        </div>

        <div className={style.header_middle}>
          <Link to="/" className={style.logo}>
            <img src="/logo.png" alt="로고" />
          </Link>
          <ul className={style.icon_container}>
            <li>
              <Link to="/search">
                <img src="/search.png" alt="검색" />
              </Link>
            </li>
            <li>
              <Link
                to="/likeslist"
                onClick={(e) => handleProtectedRoute(e, "/likeslist")}
              >
                <img src="/heart.png" alt="좋아요" />
              </Link>
            </li>
            <li>
              <Link
                to="/mypage"
                onClick={(e) => handleProtectedRoute(e, "/mypage")}
              >
                <img src="/mypage.png" alt="마이페이지" />
              </Link>
            </li>
            <li className={style.cart_icon}>
              <Link
                to="/cart"
                onClick={(e) => handleProtectedRoute(e, "/cart")}
              >
                <img src="/cart.png" alt="장바구니" />
                {cartItems.length > 0 && (
                  <span className={style.cart_count}>{cartItems.length}</span>
                )}
              </Link>
            </li>
          </ul>
        </div>

        <div className={style.header_bottom} onMouseLeave={handleMouseLeave}>
          <ul className={style.category_nav}>
            {mainCategories.map((category) => (
              <li
                key={category.categoryId}
                className={
                  category.categoryId === activeCategory ? style.active : ""
                }
                onMouseEnter={() => handleMouseEnter(category.categoryId)}
              >
                {category.name}
              </li>
            ))}
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

        {/* 서브 카테고리 네비게이션 */}
        <div
          className={`${style.category_dropdown} ${
            isDropdownVisible ? style.visible : ""
          }`}
          onMouseEnter={() => setIsDropdownVisible(true)}
          onMouseLeave={handleMouseLeave}
        >
          {activeCategory && (
            <CategoryNav
              activeCategory={activeCategory}
              isDropdownVisible={isDropdownVisible}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

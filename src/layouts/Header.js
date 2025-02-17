import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../api/redux/loginSlice";
import style from "../styles/Header.module.css";
import NotificationDropdown from "../components/dropdown/NotificationDropdown";
import MessageDropdown from "../components/dropdown/MessageDropdown";
import { getMainCategories } from "../api/categoryApi";
import CategoryNav from "../components/CategoryNav";

const Header = () => {
  const { nickName } = useSelector((state) => state.loginSlice);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showHeaderTop, setShowHeaderTop] = useState(true);
  const [mainCategories, setMainCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

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

  return (
    <div className={style.header}>
      <div className={style.inner}>
        <div
          className={`${style.header_top} ${showHeaderTop ? "" : style.hidden}`}
        >
          <ul className={style.login_nav}>
            {nickName ? (
              <li className={style.logout} onClick={logout}>
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
              <Link>알림</Link>
              {showNotifications && <NotificationDropdown notifications={[]} />}
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
              <Link to="/likeslist">
                <img src="/heart.png" alt="좋아요" />
              </Link>
            </li>
            <li>
              <Link to="/mypage">
                <img src="/mypage.png" alt="마이페이지" />
              </Link>
            </li>
            <li>
              <Link to="/cart">
                <img src="/cart.png" alt="장바구니" />
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

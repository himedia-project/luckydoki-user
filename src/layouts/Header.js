import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { logoutPost } from "../api/loginApi";
import { logout } from "../api/redux/loginSlice";
import style from "../styles/Header.module.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { nickName } = useSelector((state) => state.loginSlice);

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
        <div className={style.header_top}>
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
            <li className={style.notice}>
              <img src="/notification.png" />
              <Link to="/notice">알림</Link>
            </li>

            {/* 메시지 */}
            <li className={style.message}>
              <img src="/chat.png" />
              <Link to="/message">메시지</Link>
            </li>
          </ul>
        </div>

        <div className={style.header_middle}>
          {/* 로고 */}
          <Link to="/" className={style.logo}>
            <img src="/logo.png" />
          </Link>

          <ul className={style.icon_container}>
            {/* 검색아이콘 */}
            <li>
              <Link to="/search">
                <img src="/search.png" />
              </Link>
            </li>

            {/* 하트아이콘 */}
            <li>
              <Link to="/likeslist" onClick={handleNeedLoginLink}>
                <img src="/heart.png" />
              </Link>
            </li>

            {/* 마이페이지아이콘 */}
            <li>
              <Link to="/mypage" onClick={handleNeedLoginLink}>
                <img src="/mypage.png" />
              </Link>
            </li>

            {/* 카트아이콘 */}
            <li>
              <Link to="/cart" onClick={handleNeedLoginLink}>
                <img src="/cart.png" />
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

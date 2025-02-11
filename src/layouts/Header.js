import React, { useState } from "react";
import { Link } from "react-router-dom";
import style from "../styles/Header.module.css";

const Header = () => {
  return (
    <div className={style.header}>
      <div className={style.inner}>
        <div className={style.header_top}>
          <ul className={style.login_nav}>
            <li>
              <Link to="/login">로그인</Link>
            </li>
            <li className={style.notice}>
              <img src="/notification.png" />
              <Link to="/notice">알림</Link>
            </li>
            <li className={style.message}>
              <img src="/chat.png" />
              <Link to="/message">메시지</Link>
            </li>
          </ul>
        </div>
        <div className={style.header_middle}>
          <Link to="/" className={style.logo}>
            <img src="/logo.png" />
          </Link>
          <ul className={style.icon_container}>
            <li>
              <Link to="/search">
                <img src="/search.png" />
              </Link>
            </li>
            <li>
              <Link to="/mypage/heart">
                <img src="/heart.png" />
              </Link>
            </li>
            <li>
              <Link to="/shop">
                <img src="/shop.png" />
              </Link>
            </li>
            <li>
              <Link to="/mypage">
                <img src="/mypage.png" />
              </Link>
            </li>
            <li>
              <Link to="/cart">
                <img src="/cart.png" />
              </Link>
            </li>
          </ul>
        </div>
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

import React from "react";
import style from "../styles/MyPageSideMenu.module.css";
import { NavLink } from "react-router-dom";

export default function MyPageSideMenu() {
  return (
    <div className={style.menu_container}>
      <div>
        <h2>MY PAGE</h2>
        <div className={style.bar}></div>
      </div>
      <div className={style.li_box}>
        <div className={style.box}>
          <b>주문</b>
          <p>
            <NavLink
              to="/order"
              className={({ isActive }) => (isActive ? style.active : "")}
            >
              주문 목록 조회
            </NavLink>
          </p>
        </div>
        <div className={style.bar}></div>
      </div>
      <div className={style.li_box}>
        <div className={style.box}>
          <b>알림 및 메시지</b>
          <p>
            <NavLink
              to="/notice"
              className={({ isActive }) => (isActive ? style.active : "")}
            >
              알림
            </NavLink>
          </p>
          <p>
            <NavLink
              to="/message"
              className={({ isActive }) => (isActive ? style.active : "")}
            >
              메시지
            </NavLink>
          </p>
        </div>
        <div className={style.bar}></div>
      </div>
      <div className={style.li_box}>
        <div className={style.box}>
          <b>MY</b>
          <p>
            <NavLink
              to="/my_review"
              className={({ isActive }) => (isActive ? style.active : "")}
            >
              나의 리뷰
            </NavLink>
          </p>
          <p>
            <NavLink
              to="/likeslist"
              className={({ isActive }) => (isActive ? style.active : "")}
            >
              찜목록
            </NavLink>
          </p>
          <p>
            <NavLink
              to="/coupon"
              className={({ isActive }) => (isActive ? style.active : "")}
            >
              쿠폰
            </NavLink>
          </p>
          <p>
            <NavLink
              to="/shop"
              className={({ isActive }) => (isActive ? style.active : "")}
            >
              샵
            </NavLink>
          </p>
        </div>
        <div className={style.bar}></div>
      </div>
      <div className={style.li_box}>
        <div className={style.box}>
          <b>내 정보관리</b>
          <p>
            <NavLink
              to="/userinfo"
              className={({ isActive }) => (isActive ? style.active : "")}
            >
              회원정보
            </NavLink>
          </p>
        </div>
        <div className={style.bar}></div>
      </div>
    </div>
  );
}

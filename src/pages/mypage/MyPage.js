import React from "react";
import style from "../../styles/MyPage.module.css";
import { Link } from "react-router-dom";

export default function MyPage() {
  return (
    <div className={style.mypage_container}>
      <div className={style.userinfo_container}>
        <div className={style.userinfo_top}>
          <div className={style.text_box}>
            <p>nickname</p>
            <span>님 반갑습니다</span>
          </div>
          <div className={style.black_bar}></div>
        </div>
        <div className={style.userinfo_middle}>
          <div className={style.user_data}>
            <img src="profile.png" />
            <div className={style.userinfo}>
              <p>abcde@email.com</p>
              <Link to="/userinfo">내 정보 변경</Link>
            </div>
          </div>
          <div className={style.coupon_box}>
            <div className={style.box}>
              <p>포인트</p>
              <p>0</p>
            </div>
            <div className={style.bar}></div>
            <Link to="/coupon" className={style.box}>
              <p>쿠폰</p>
              <p>0</p>
            </Link>
            <div className={style.bar}></div>
            <div className={style.box}>
              <p>응모권</p>
              <p>0</p>
            </div>
          </div>
        </div>
        <div className={style.userinfo_bottom}></div>
      </div>
      <div className={style.wishlist_container}>
        <div className={style.wish_header}>
          <h3>찜한 상품</h3>
          <Link to="/wishlist">더보기</Link>
        </div>
        <div className={style.wish_content}>
          <p>찜한 상품품이 없습니다.</p>
        </div>
      </div>
      <div className={style.wishlist_container}>
        <div className={style.wish_header}>
          <h3>찜한 샵</h3>
          <Link to="/wishlist">더보기</Link>
        </div>
        <div className={style.wish_content}>
          <p>찜한 샵이 없습니다.</p>
        </div>
      </div>
    </div>
  );
}

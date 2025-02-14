import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import style from "../styles/MyPageLayout.module.css";
import MyPageSideMenu from "./MyPageSideMenu";
import { getMyProfile } from "../api/memberApi";

export default function MyPageLayout() {
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/mypage")) {
      getMyProfile()
        .then((response) => {
          setUserInfo(response.data);
        })
        .catch((error) => {
          console.error("내 정보 가져오기 실패:", error);
        });
    }
  }, [location.pathname]);

  return (
    <>
      <Header />
      <main className={style.inner}>
        <MyPageSideMenu userInfo={userInfo} />
        <Outlet context={{ userInfo }} className={style.content} />
      </main>
      <Footer />
    </>
  );
}

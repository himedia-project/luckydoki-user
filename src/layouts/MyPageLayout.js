import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { getMyProfile } from "../api/memberApi";
import style from "../styles/MyPageLayout.module.css";
import Footer from "./Footer";
import Header from "./Header";
import MyPageSideMenu from "./MyPageSideMenu";
import TopButton from "../components/button/TopButton";

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
        <TopButton />
      </main>
      <Footer />
    </>
  );
}

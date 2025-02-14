import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import style from "../styles/MyPageLayout.module.css";
import MyPageSideMenu from "./MyPageSideMenu";
import { getMyProfile } from "../api/memberApi";
import { useDispatch } from "react-redux";
import { setShopId } from "../api/redux/infoSlice";

export default function MyPageLayout() {
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname.startsWith("/mypage")) {
      getMyProfile()
        .then((response) => {
          setUserInfo(response.data);
          if (response.data?.shopId) {
            dispatch(setShopId(response.data.shopId));
          }
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

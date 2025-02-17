import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { getMyProfile } from "../api/memberApi";
import { setShopId } from "../api/redux/infoSlice";
import TopButton from "../components/button/TopButton";
import style from "../styles/MainLayout.module.css";
import Footer from "./Footer";
import Header from "./Header";

const MainLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getMyProfile()
      .then((response) => {
        if (response.data?.shopId) {
          dispatch(setShopId(response.data.shopId));
        }
      })
      .catch((error) => {
        console.error("내 정보 가져오기 실패:", error);
      });
  }, []);

  return (
    <>
      <Header />
      <main className={style.content_container}>
        <Outlet />
        <TopButton />
      </main>
      <Footer />
    </>
  );
};
export default MainLayout;

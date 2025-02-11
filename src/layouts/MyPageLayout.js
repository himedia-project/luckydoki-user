import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import style from "../styles/MyPageLayout.module.css";
import MyPageSideMenu from "./MyPageSideMenu";

export default function MyPageLayout() {
  return (
    <>
      <Header />
      <main className={style.inner}>
        <MyPageSideMenu />
        <Outlet className={style.content} />
      </main>
      <Footer />
    </>
  );
}

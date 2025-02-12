import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import style from "../styles/MainLayout.module.css";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className={style.content_container}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
export default MainLayout;

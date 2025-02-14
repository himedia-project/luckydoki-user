import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import style from "../styles/MainLayout.module.css";
import TopButton from "../components/TopButton";

const MainLayout = () => {
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

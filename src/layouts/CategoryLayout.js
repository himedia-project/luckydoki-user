import React from "react";
import { Outlet, useParams } from "react-router-dom";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import CategorySideMenu from "../layouts/CategorySideMenu";
import style from "../styles/CategoryLayout.module.css";
import TopButton from "../components/button/TopButton";

const CategoryLayout = () => {
  return (
    <>
      <Header />
      <main className={style.layoutContainer}>
        <CategorySideMenu />
        <div className={style.mainContents}>
          <Outlet />
          <TopButton />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CategoryLayout;

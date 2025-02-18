import React from "react";
import { Outlet, useParams } from "react-router-dom";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import CategorySideMenu from "../layouts/CategorySideMenu";
import style from "../styles/CategoryLayout.module.css";

const CategoryLayout = () => {
  return (
    <>
      <Header />
      <main className={style.layoutContainer}>
        <CategorySideMenu />
        {/* ✅ Outlet을 div로 감싸서 스타일 적용 */}
        <div className={style.mainContents}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CategoryLayout;

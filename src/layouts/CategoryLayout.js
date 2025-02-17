import React from "react";
import { Outlet, useParams } from "react-router-dom";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import CategorySideMenu from "../layouts/CategorySideMenu";
import style from "../styles/CategoryLayout.module.css";

const CategoryLayout = () => {
  const { categoryId } = useParams();

  return (
    <>
      <Header />
      <main className={style.layoutContainer}>
        <CategorySideMenu />
        <Outlet context={{ categoryId }} />
      </main>
      <Footer />
    </>
  );
};

export default CategoryLayout;

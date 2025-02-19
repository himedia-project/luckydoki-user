import React from "react";
import style from "../styles/AiSuggestPage.module.css";
import ProductCard from "../components/card/ProductCard";

export default function AiSuggestPage() {
  return (
    <div className={style.productContainer}>
      <h2 className={style.title}>AI 추천상품</h2>
      <div className={style.contentBox}>
        <ProductCard />
      </div>
    </div>
  );
}

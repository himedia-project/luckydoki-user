import React from "react";
import style from "../styles/CartPage.module.css";

const CartPage = () => {
  return (
    <div className={style.cart_container}>
      <div className={style.cart_header}>
        <h2>장바구니</h2>
        <div className={style.cart_steps}>
          <span className={style.active}>01 장바구니</span>
          <span>02 주문 결제</span>
          <span>03 주문 완료</span>
        </div>
      </div>
      <div className={style.cart_content}>
        <div className={style.empty_cart}>
          <img src="/cart_icon.png" alt="빈 장바구니" />
          <p>장바구니에 담긴 상품이 없습니다.</p>
          <button className={style.shopping_btn}>상품 구경하기</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartItemList } from "../api/cartApi";
import { setCartItems } from "../api/redux/cartSlice";
import style from "../styles/CartPage.module.css";
import ImageLoader from "../components/card/ImageLoader";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cartSlice);
  const { cartItems, totalDiscountPrice } = cartState || {
    cartItems: [],
    totalDiscountPrice: 0,
  };
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setSelectedItems([]);
  }, [cartItems]);

  const isAllSelected =
    cartItems.length > 0 &&
    cartItems.length === selectedItems.length &&
    cartItems.every((item) => selectedItems.includes(item.cartItemId));

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allItemIds = cartItems.map((item) => item.cartItemId);
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (cartItemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(cartItemId)) {
        return prev.filter((id) => id !== cartItemId);
      } else {
        return [...prev, cartItemId];
      }
    });
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const data = await getCartItemList();
        dispatch(setCartItems(data));
      } catch (error) {
        console.error("장바구니 조회 실패:", error);
      }
    };
    fetchCartItems();
  }, [dispatch]);

  if (cartItems.length === 0) {
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
            <img src="/cart-icon.svg" alt="빈 장바구니" />
            <p>장바구니에 담긴 상품이 없습니다.</p>
            <button className={style.shopping_btn}>쇼핑 구경하기</button>
          </div>
        </div>
      </div>
    );
  }

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
        <div className={style.cart_items}>
          <div className={style.cart_item_header}>
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
            />
            <span>전체선택</span>
          </div>
          {cartItems.map((item) => (
            <div key={item.cartItemId} className={style.cart_item}>
              <input
                type="checkbox"
                checked={selectedItems.includes(item.cartItemId)}
                onChange={() => handleSelectItem(item.cartItemId)}
              />
              <ImageLoader
                imagePath={item.imageName}
                alt={item.productName}
                className={style.product_image}
              />
              <div className={style.product_info}>
                <h3>{item.productName}</h3>
                <div className={style.price_info}>
                  <span className={style.discount_price}>
                    {item.discountPrice.toLocaleString()}원
                  </span>
                  <span className={style.original_price}>
                    {item.price.toLocaleString()}원
                  </span>
                  <span className={style.discount_rate}>
                    {item.discountRate}%
                  </span>
                </div>
              </div>
              <div className={style.quantity_control}>
                <button>-</button>
                <span>1</span>
                <button>+</button>
                <button>변경</button>
              </div>
              <button className={style.delete_btn}>삭제</button>
            </div>
          ))}
        </div>
        <div className={style.cart_summary}>
          <h3>주문 예상 금액</h3>
          <div className={style.summary_row}>
            <span>상품금액</span>
            <span>{totalDiscountPrice.toLocaleString()}원</span>
          </div>
          <div className={style.total}>
            <span>총 결제금액</span>
            <span>{totalDiscountPrice.toLocaleString()}원</span>
          </div>
          <button className={style.order_btn}>주문하기</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

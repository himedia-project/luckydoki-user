import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartItemList,
  deleteCartItem,
  deleteAllCartItems,
  changeCartItemQty,
} from "../api/cartApi";
import { setCartItems, clearCartItems } from "../api/redux/cartSlice";
import style from "../styles/CartPage.module.css";
import ImageLoader from "../components/card/ImageLoader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getProductList } from "../api/productApi";
import ProductSwiper from "../components/swiper/ProductSwiper";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cartSlice);
  const { cartItems, totalDiscountPrice } = cartState || {
    cartItems: [],
    totalDiscountPrice: 0,
  };
  const [selectedItems, setSelectedItems] = useState([]);
  const [productList, setProductList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((id) =>
        cartItems.some((item) => item.cartItemId === id)
      )
    );
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

  const handleDeleteItem = async (cartItemId) => {
    try {
      await deleteCartItem(cartItemId);
      const updatedData = await getCartItemList();
      dispatch(setCartItems(updatedData));
      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "상품이 삭제되었습니다.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "상품 삭제 중 오류가 발생했습니다.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "선택된 상품이 없습니다.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      await deleteAllCartItems(selectedItems);
      const updatedData = await getCartItemList();
      if (updatedData.length === 0) {
        dispatch(clearCartItems());
      } else {
        dispatch(setCartItems(updatedData));
      }
      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "선택한 상품이 삭제되었습니다.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("선택 상품 삭제 실패:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "상품 삭제 중 오류가 발생했습니다.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleQuantityChange = async (cartItemId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    try {
      await changeCartItemQty(cartItemId, newQty);
      const updatedData = await getCartItemList();
      dispatch(setCartItems(updatedData));
    } catch (error) {
      console.error("수량 변경 실패:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "수량 변경 중 오류가 발생했습니다.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // 개별 상품의 총 할인가격 계산 함수 추가
  const calculateItemTotal = (item) => {
    return item.discountPrice * item.qty;
  };

  // 전체 상품의 총 금액 계산 함수 수정
  const calculateTotalAmount = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.cartItemId))
      .reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const handleOrderClick = () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "주문할 상품을 선택해주세요.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    // 선택된 상품들만 필터링
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.cartItemId)
    );

    // 선택된 상품들의 총 금액 계산
    const selectedTotalAmount = selectedProducts.reduce(
      (total, item) => total + item.discountPrice * item.qty,
      0
    );

    Swal.fire({
      title: "결제진행하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00de90",
      cancelButtonColor: "#d33",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/payment", {
          state: {
            selectedProducts,
            totalAmount: selectedTotalAmount, // 선택된 상품들의 총 금액만 전달
          },
        });
      }
    });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
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
    const fetchProductList = async () => {
      try {
        const response = await getProductList();
        setProductList(response.data);
      } catch (error) {
        console.error("상품 리스트 불러오는 데 실패했습니다.", error);
      }
    };

    fetchProductList();
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
            <img src="/cart_icon.png" alt="빈 장바구니" />
            <p>장바구니에 담긴 상품이 없습니다.</p>
            <button
              className={style.shopping_btn}
              onClick={() => navigate("/popular")}
            >
              쇼핑 구경하기
            </button>
          </div>
        </div>
        <section className={style.containContainer}>
          <ProductSwiper title="이런 상품은 어떠세요?" items={productList} />
        </section>
      </div>
    );
  }

  return (
    <>
      <div className={style.cart_container}>
        <div className={style.cart_header}>
          <h2>장바구니</h2>
          <div className={style.cart_steps}>
            <span className={`${style.active} ${style.steps_first}`}>
              01 장바구니
            </span>
            <span className={`${style.steps_second}`}>02 주문 결제</span>
            <span>03 주문 완료</span>
          </div>
        </div>
        <div
          className={`${style.cart_content} ${
            cartItems.length > 0 ? style.has_items : ""
          }`}
        >
          <div className={style.cart_items}>
            <div className={style.cart_item_header}>
              <div className={style.select_all_wrapper}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className={style.all_select_box}
                />
                <span>전체선택</span>
              </div>
              <button
                className={style.delete_selected_btn}
                onClick={handleDeleteSelected}
              >
                선택삭제
              </button>
            </div>
            {cartItems.map((item) => (
              <div key={item.cartItemId} className={style.cart_item}>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.cartItemId)}
                  onChange={() => handleSelectItem(item.cartItemId)}
                  className={style.one_select_box}
                />
                <div className={style.cartLeft}>
                  <div
                    onClick={() => handleProductClick(item.productId)}
                    className={style.productInfoBox}
                  >
                    <ImageLoader
                      imagePath={item.imageName}
                      alt={item.productName}
                      className={style.product_image}
                    />
                    <div className={style.product_info}>
                      <h3>{item.productName}</h3>
                      <div className={style.price_info}>
                        <span className={style.discount_price}>
                          {calculateItemTotal(item).toLocaleString()}원
                        </span>
                        <span className={style.original_price}>
                          {(item.price * item.qty).toLocaleString()}원
                        </span>
                        <span className={style.discount_rate}>
                          {item.discountRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={style.controlNav}>
                    <div className={style.quantity_control}>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.cartItemId, item.qty, -1)
                        }
                      >
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.cartItemId, item.qty, 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className={style.delete_btn}
                      onClick={() => handleDeleteItem(item.cartItemId)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={style.cart_summary}>
            <h3>주문 예상 금액</h3>
            <div className={style.summary_row}>
              <span>상품금액</span>
              <span>{calculateTotalAmount().toLocaleString()}원</span>
            </div>
            <div className={style.total}>
              <span>총 결제금액</span>
              <span>{calculateTotalAmount().toLocaleString()}원</span>
            </div>
            <button className={style.order_btn} onClick={handleOrderClick}>
              주문하기
            </button>
          </div>
        </div>
        <section className={style.containContainer}>
          <ProductSwiper title="이런 상품은 어떠세요?" items={productList} />
        </section>
      </div>
    </>
  );
};

export default CartPage;

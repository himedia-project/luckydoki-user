import React, { useEffect, useState } from "react";
import style from "../../styles/OrderPage.module.css";
import { cancelOrder, getOrderList } from "../../api/orderApi";
import ImageLoader from "../../components/card/ImageLoader";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrderList();
        setOrders(response.data);
      } catch (error) {
        console.error("주문 내역을 불러오는 데 실패했습니다.", error);
      }
    };

    fetchOrders();
  }, [location.pathname]);

  const handleCancelOrder = async (orderId) => {
    try {
      const result = await Swal.fire({
        title: "주문을 취소하시겠습니까?",
        text: "한 번 취소하면 되돌릴 수 없습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "네",
        cancelButtonText: "아니요",
        // reverseButtons: true,
      });

      if (result.isConfirmed) {
        await cancelOrder(orderId);

        Swal.fire({
          title: "취소 완료",
          text: "주문이 취소되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, orderStatus: "CANCEL" }
              : order
          )
        );
      }
    } catch (error) {
      console.error("주문 취소 실패:", error);
      Swal.fire({
        title: "오류",
        text: "주문 취소에 실패했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  const handleWriteReview = (item) => {
    navigate("/review_add", {
      state: {
        productId: item?.productId,
        productName: item?.productName,
        productImage: item?.image,
      },
    });
  };

  return (
    <div className={style.container}>
      <h2 className={style.title}>주문 내역</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.orderId} className={style.orderGroup}>
            <h3 className={style.orderCode}>
              {new Date(order.orderDate)
                .toLocaleDateString("ko-KR")
                .replaceAll(" ", " ")
                .replace("년", "")
                .replace("월", "")
                .replace("일", "")
                .replace(/\.$/, "")
                .trim()}{" "}
              주문
            </h3>

            {order.orderItems.map((item) => (
              <div key={item.productId} className={style.orderItem}>
                <div className={style.productInfo}>
                  <ImageLoader
                    imagePath={item.image}
                    alt={item.productName}
                    className={style.productImage}
                  />
                  <div className={style.details}>
                    <p className={style.productName}>{item.productName}</p>
                    <p>
                      {item.count}개 / {item.orderPrice.toLocaleString()}원
                    </p>
                  </div>
                </div>
                <div className={style.buttonContainer}>
                  {order.orderStatus === "CANCEL" ? (
                    <button className={style.disabledButton} disabled>
                      취소 완료
                    </button>
                  ) : (
                    <>
                      <button
                        className={style.cancelButton}
                        onClick={() => handleCancelOrder(order.orderId)}
                      >
                        주문 취소
                      </button>
                      <button
                        className={style.reviewButton}
                        onClick={() => handleWriteReview(item)}
                      >
                        리뷰 작성
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p className={style.noOrders}>주문 내역이 없습니다.</p>
      )}
    </div>
  );
}

import axiosInstance from "./axiosInstance";

// 유저 주문 리스트 가져오기
export const getOrderList = async () => {
  return await axiosInstance.get("/order/hist/list");
};

// 주문하기
// {
//   "couponId": 6,
//   "cartItems": [
//       {
//           "productId": 247,
//           "count": 2
//       },
//       {
//           "productId": 246,
//           "count": 3
//       }
//   ]
// }
export const order = async (orderInfo) => {
  return await axiosInstance.post("/order", orderInfo);
};

// 주문 취소
export const cancelOrder = async (orderId) => {
  const res = await axiosInstance.post(`/order/${orderId}/cancel`);
  return res.data;
};

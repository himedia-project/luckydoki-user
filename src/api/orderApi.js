import axiosInstance from "./axiosInstance";

// 유저 주문 리스트 가져오기
export const getOrders = async () => {
  return await axiosInstance.get("/order/hist/list");
};

// 주문하기

export const order = async (orderInfo) => {
  return await axiosInstance.post("/order/order", orderInfo);
};

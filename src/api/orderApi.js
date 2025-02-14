import axiosInstance from "./axiosInstance";

// 유저 주문 리스트 가져오기
export const getOrders = async () => {
  return await axiosInstance.get("/order/hist/list");
};

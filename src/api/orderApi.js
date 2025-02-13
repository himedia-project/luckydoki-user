import axiosInstance from "./axiosInstance";

export const getOrders = async () => {
  return axiosInstance.get("/api/order/hist/list");
};

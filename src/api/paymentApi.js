import axiosInstance from "./axiosInstance";

export const paymentApi = {
  // 결제 정보 임시 저장
  preparePayment: async (orderData) => {
    const response = await axiosInstance.post("/payment/prepare", orderData);
    return response.data;
  },

  // 결제 금액 검증
  validatePayment: async (orderId, amount) => {
    const response = await axiosInstance.get(
      `/payment/validate/${orderId}?amount=${amount}`
    );
    return response.data;
  },

  // 결제 승인
  confirmPayment: async (paymentKey, orderId, amount) => {
    const response = await axiosInstance.post("/payment/confirm", {
      paymentKey,
      orderId,
      amount,
    });
    return response.data;
  },

  // 결제 취소
  cancelPayment: async (orderId, cancelReason) => {
    const response = await axiosInstance.post(`/payment/${orderId}/cancel`, {
      cancelReason,
    });
    return response.data;
  },
};

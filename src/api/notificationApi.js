import axiosInstance from "./axiosInstance";

// notification api
// 알림 목록 조회
export const getNotificationList = async () => {
  const response = await axiosInstance.get("/notification/list");
  return response.data;
};

// 알림 읽음 처리
export const readNotification = async (notificationId) => {
  const response = await axiosInstance.post(
    `/notification/read/${notificationId}`
  );
  return response.data;
};

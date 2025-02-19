import axiosInstance from "./axiosInstance";

// POST http://localhost:8080/api/member/fcm-token
export const updateFCMToken = async (fcmToken, email) => {
  const response = await axiosInstance.post("/member/fcm-token", {
    fcmToken: fcmToken,
    email: email,
  });
  return response.data;
};

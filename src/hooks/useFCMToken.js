import { getToken } from "firebase/messaging";
import { messaging } from "../config/firebase-config";
import * as fcmApi from "../api/fcmApi";

export const useFCMToken = () => {
  const updateToken = async (email) => {
    try {
      const token = await getToken(messaging, {
        vapidKey:
          "BC-j0Yeoggc9GXdnEiAT1_bFTUMeMl2aS5Ucy4W_jhfprqW43TCjVAZm462rsQBr3wctC5OvSs1CNne39q7kVEw",
      });
      console.log("FCM token obtained:", token);
      await fcmApi.updateFCMToken(token, email);
      return token;
    } catch (error) {
      console.error("FCM 토큰 업데이트 실패:", error);
      throw error;
    }
  };

  return { updateToken };
};

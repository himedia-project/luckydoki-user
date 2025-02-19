import { getToken } from "firebase/messaging";
import { messaging } from "../config/firebase-config";
import * as fcmApi from "../api/fcmApi";

export const useFCMToken = () => {
  console.log("useFCMToken start!");
  const updateToken = async (email) => {
    try {
      // 브라우저에 알림 권한 요청
      const permission = await Notification.requestPermission();

      // 사용자가 알림을 허용했을 때만 FCM 토큰 업데이트
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey:
            "BC-j0Yeoggc9GXdnEiAT1_bFTUMeMl2aS5Ucy4W_jhfprqW43TCjVAZm462rsQBr3wctC5OvSs1CNne39q7kVEw",
        });
        console.log("token", token);
        await fcmApi.updateFCMToken(token, email);
      } else {
        console.log("알림 권한 획득 실패");
      }
    } catch (error) {
      console.error("FCM 토큰 업데이트 실패:", error);
    }
  };

  return { updateToken };
};

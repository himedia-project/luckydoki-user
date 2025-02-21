import { useEffect } from "react";
import { onMessage, getToken } from "firebase/messaging";
import { messaging } from "../config/firebase-config";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationItems } from "../api/redux/notificationSlice";
import { clearNotificationItems } from "../api/redux/notificationSlice";

export const useNotification = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notificationSlice.notificationItems
  );

  useEffect(() => {
    console.log("useNotification hook initialized");

    // 브로드캐스트 채널 수신 설정
    const channel = new BroadcastChannel("notifications");
    channel.onmessage = (event) => {
      const newNotification = event.data;
      dispatch(setNotificationItems((prev) => [newNotification, ...prev]));
    };

    const requestPermissionAndToken = async () => {
      try {
        console.log("Requesting notification permission...");
        const permission = await Notification.requestPermission();
        console.log("Notification permission:", permission);

        if (permission === "granted") {
          console.log("Getting FCM token...");
          const token = await getToken(messaging, {
            vapidKey:
              "BC-j0Yeoggc9GXdnEiAT1_bFTUMeMl2aS5Ucy4W_jhfprqW43TCjVAZm462rsQBr3wctC5OvSs1CNne39q7kVEw",
          });
          console.log("FCM Token obtained:", token);
        }
      } catch (error) {
        console.error("Error in requestPermissionAndToken:", error);
      }
    };

    // 포그라운드 메시지 처리
    const setupMessageListener = () => {
      console.log("Setting up message listener...");
      try {
        return onMessage(messaging, (payload) => {
          console.log("Foreground message received:", payload);

          const newNotification = {
            title: payload.notification?.title || payload.data?.title,
            body: payload.notification?.body || payload.data?.body,
            type: payload.data?.type,
            timestamp: payload.data?.timestamp || new Date().toISOString(),
          };

          dispatch(setNotificationItems((prev) => [newNotification, ...prev]));
        });
      } catch (error) {
        console.error("Error in message listener setup:", error);
        return () => {};
      }
    };

    requestPermissionAndToken();
    const unsubscribe = setupMessageListener();

    return () => {
      console.log("Cleaning up notification listener");
      unsubscribe();
      channel.close();
    };
  }, [dispatch]);

  const clearNotifications = () => {
    dispatch(clearNotificationItems());
  };

  return {
    notifications,
    clearNotifications,
    notificationCount: notifications.length,
  };
};

import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "../config/firebase-config";
import { useDispatch, useSelector } from "react-redux";
import {
  setNotificationItems,
  clearNotificationItems,
} from "../api/redux/notificationSlice";

export const useNotification = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notificationSlice.notificationItems
  );

  useEffect(() => {
    // 브로드캐스트 채널 수신 설정
    const channel = new BroadcastChannel("notifications");
    channel.onmessage = (event) => {
      const newNotification = event.data;
      dispatch(setNotificationItems((prev) => [newNotification, ...prev]));
    };

    // 포그라운드 메시지 처리
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      const newNotification = {
        title: payload.notification?.title || payload.data?.title,
        body: payload.notification?.body || payload.data?.body,
        type: payload.data?.type,
        timestamp: payload.data?.timestamp || new Date().toISOString(),
      };
      dispatch(setNotificationItems((prev) => [newNotification, ...prev]));
    });

    return () => {
      unsubscribe();
      channel.close();
    };
  }, [dispatch]);

  return {
    notifications,
    clearNotifications: () => dispatch(clearNotificationItems()),
    notificationCount: notifications.length,
  };
};

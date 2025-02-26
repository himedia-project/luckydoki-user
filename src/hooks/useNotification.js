import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "../config/firebase-config";
import { useDispatch, useSelector } from "react-redux";
import {
  setNotificationItems,
  clearNotificationItems,
} from "../api/redux/notificationSlice";
import { clearMessageItems, setMessageItems } from "../api/redux/messageSlice";

export const useNotification = () => {
  const dispatch = useDispatch();
  const currentUserEmail = useSelector((state) => state.loginSlice.email);
  const { email: notificationEmail, notificationItems } = useSelector(
    (state) => state.notificationSlice
  );

  const { email: messageEmail, messageItems } = useSelector(
    (state) => state.messageSlice
  );

  // 현재 로그인한 사용자의 알림만 필터링
  const currentUserNotifications =
    currentUserEmail === notificationEmail ? notificationItems : [];

  const currentUserMessages =
    currentUserEmail === messageEmail ? messageItems : [];

  useEffect(() => {
    // 브로드캐스트 채널 수신 설정
    const channel = new BroadcastChannel("notifications");
    channel.onmessage = (event) => {
      // 현재 로그인한 사용자의 알림만 추가
      if (currentUserEmail === notificationEmail) {
        const newNotification = event.data;
        dispatch(setNotificationItems((prev) => [newNotification, ...prev]));
      }
      // 메시지 알림 추가
      if (currentUserEmail === messageEmail) {
        const newMessage = event.data;
        dispatch(
          setMessageItems((prev) =>
            Array.isArray(prev) ? [newMessage, ...prev] : [newMessage]
          )
        );
      }
    };

    // 포그라운드 메시지 처리
    const unsubscribe = onMessage(messaging, (payload) => {
      // 현재 로그인한 사용자의 알림만 추가
      if (
        // currentUserEmail === notificationEmail &&
        payload.notification?.type != "NEW_MESSAGE"
      ) {
        console.log("Foreground notification received:", payload);
        const newNotification = {
          title: payload.notification?.title || payload.data?.title,
          body: payload.notification?.body || payload.data?.body,
          type: payload.data?.type,
          timestamp: payload.data?.timestamp || new Date().toISOString(),
        };
        dispatch(setNotificationItems((prev) => [newNotification, ...prev]));
      }
      if (
        // currentUserEmail === messageEmail &&
        payload.data?.type == "NEW_MESSAGE"
      ) {
        console.log("Foreground message received:", payload);
        const newMessage = {
          title: payload.notification?.title || payload.data?.title,
          body: payload.notification?.body || payload.data?.body,
          type: payload.data?.type,
          timestamp: payload.data?.timestamp || new Date().toISOString(),
        };
        dispatch(
          setMessageItems((prev) =>
            Array.isArray(prev) ? [newMessage, ...prev] : [newMessage]
          )
        );
      }
    });

    return () => {
      unsubscribe();
      channel.close();
    };
  }, [dispatch, currentUserEmail, notificationEmail, messageEmail]);

  return {
    notifications: currentUserNotifications,
    clearNotifications: () => dispatch(clearNotificationItems()),
    notificationCount: currentUserNotifications?.length || 0,

    messages: currentUserMessages,
    clearMessages: () => dispatch(clearMessageItems()),
    messageCount: currentUserMessages?.length || 0,
  };
};

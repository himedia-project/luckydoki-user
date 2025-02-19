import { useEffect, useState } from "react";
import { onMessage, getToken } from "firebase/messaging";
import { messaging } from "../config/firebase-config";
import { useDispatch } from "react-redux";
import { setNotificationItems } from "../api/redux/notificationSlice";
import { clearNotificationItems } from "../api/redux/notificationSlice";

export const useNotification = () => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    console.log("useNotification hook initialized");

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

    const setupMessageListener = () => {
      console.log("Setting up message listener...");
      try {
        return onMessage(messaging, (payload) => {
          console.log("Raw payload received:", payload);
          console.log("Notification data:", payload.data);
          console.log("Notification content:", payload.notification);

          const newNotification = {
            title: payload.notification?.title || payload.data?.title,
            body: payload.notification?.body || payload.data?.body,
            type: payload.data?.type,
            timestamp: payload.data?.timestamp || new Date().toISOString(),
          };

          console.log("Processed notification:", newNotification);

          setNotifications((prev) => {
            console.log("Previous notifications:", prev);
            return [newNotification, ...prev];
          });
          dispatch(setNotificationItems((prev) => [newNotification, ...prev]));
          setNotificationCount((prev) => prev + 1);
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
    };
  }, [dispatch]);

  const clearNotifications = () => {
    dispatch(clearNotificationItems());
    setNotificationCount(0);
  };

  return {
    notifications,
    notificationCount,
    clearNotifications,
  };
};

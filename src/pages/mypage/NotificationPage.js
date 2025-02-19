import React, { useEffect, useState } from "react";
import { getNotificationList } from "../../api/notificationApi";
import style from "../../styles/Notification.module.css";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotificationList();
        console.log(data);
        setNotifications(data);
      } catch (error) {
        console.error("알림 목록 조회 실패:", error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className={style.notification_container}>
      <h2>알림 내역</h2>
      <div className={style.content_box}>
        {notifications.length === 0 ? (
          <p>알림 내역이 없습니다.</p>
        ) : (
          notifications.map((notification, index) => (
            <div key={index} className={style.notification_item}>
              <div className={style.profile_image}>
                <img src="/profile.png" alt="프로필 이미지" />
              </div>
              <div className={style.notification_content}>
                <p>{notification.body}</p>
                <span>{notification.createdAt}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

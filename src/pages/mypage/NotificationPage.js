import React, { useEffect, useState } from "react";
import { getNotificationExceptMessageList } from "../../api/notificationApi";
import style from "../../styles/Notification.module.css";
import { FcApprove } from "react-icons/fc";
import { FcSoundRecordingCopyright } from "react-icons/fc";
import { RiCoupon2Fill } from "react-icons/ri";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotificationExceptMessageList();
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
          <div className={style.empty}>
            <img
              src="/clover.png"
              alt="알림 없음"
              className={style.emptyIcon}
            />
            <p>알림 내역이 없습니다.</p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div key={index} className={style.notification_item}>
              <div className={style.profile_image}>
                <img src="/profile.png" alt="프로필 이미지" />
              </div>
              <div className={style.notification_content}>
                <div className={style.notification_header}>
                  <span className={style.notification_title}>
                    {notification.type === "SELLER_APPROVAL" && <FcApprove />}
                    {notification.type === "PRODUCT_APPROVAL" && (
                      <FcSoundRecordingCopyright />
                    )}
                    {(notification.type === "COUPON" ||
                      notification.type === "WELCOME") && (
                      <RiCoupon2Fill />
                    )}{" "}
                    {notification.title}
                  </span>
                  <span className={style.notification_time}>
                    {notification.timestamp}
                  </span>
                </div>
                <p className={style.notification_body}>{notification.body}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

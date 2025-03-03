import React from "react";
import styles from "../../styles/NotificationDropdown.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearNotificationItems } from "../../api/redux/notificationSlice";
import { FcApprove, FcSoundRecordingCopyright } from "react-icons/fc";
import { RiCoupon2Fill } from "react-icons/ri";

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notificationSlice.notificationItems
  );

  console.log("NotificationDropdown notifications: ", notifications);

  const email = useSelector((state) => state.loginSlice.email);

  const formatTime = (timestamp) => {
    // 2025-02-21 12:00:00 -> 2025-02-21
    const date = new Date(timestamp);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleClick = () => {
    navigate("/notification");
  };

  const handleClear = () => {
    dispatch(clearNotificationItems());
  };

  if (!email) {
    return (
      <div className={styles.dropdown}>
        <div className={styles.title}>알림</div>
        <div className={styles.empty}>
          <img src="/clover.png" alt="알림 없음" className={styles.emptyIcon} />
          <div>로그인이 필요합니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dropdown}>
      <div className={styles.title}>
        알림
        {notifications.length > 0 && (
          <button onClick={handleClear} className={styles.clearButton}>
            모두 지우기
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className={styles.empty}>
          <img src="/clover.png" alt="알림 없음" className={styles.emptyIcon} />
          <div className={styles.notNotice}>새로운 알림이 없습니다.</div>
        </div>
      ) : (
        <div className={styles.notificationList}>
          {notifications.map((notification, index) => (
            <div key={index} className={styles.item}>
              <img
                src="/profile.png"
                alt="알림 아이콘"
                className={styles.icon}
              />
              <div className={styles.textBox}>
                <div className={styles.text}>
                  <span className={styles.category}>
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
                  <span className={styles.date}>
                    {formatTime(notification.timestamp)}
                  </span>
                </div>
                <div className={styles.content}>{notification.body}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className={styles.viewAll} onClick={handleClick}>
        모두 보기
      </button>
    </div>
  );
};

export default NotificationDropdown;

import React from "react";
import styles from "../../styles/Dropdown.module.css";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = ({ notifications }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/notice");
  };

  return (
    <div className={styles.dropdown}>
      <h3 className={styles.title}>알림</h3>
      {notifications.length > 0 ? (
        <div className={styles.notificationList}>
          {notifications.map((notification, index) => (
            <div key={index} className={styles.item}>
              <img
                src="/default-profile.png"
                alt="알림 아이콘"
                className={styles.icon}
              />
              <div className={styles.textBox}>
                <div className={styles.text}>
                  <span className={styles.category}>
                    {notification.category}
                  </span>
                  <span className={styles.date}>{notification.date}</span>
                </div>
                <p className={styles.content}>{notification.message}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <img src="/clover.png" alt="비어 있음" className={styles.emptyIcon} />
          <p>알림이 없습니다.</p>
        </div>
      )}
      {notifications.length > 0 && (
        <button className={styles.viewAll} onClick={handleClick}>
          모두 보기
        </button>
      )}
    </div>
  );
};

export default NotificationDropdown;

import React from "react";
import styles from "../../styles/Dropdown.module.css";
import { useNavigate } from "react-router-dom";

const MessageDropdown = ({ messages }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/messages");
  };

  return (
    <div className={styles.dropdown}>
      <h3 className={styles.title}>메시지</h3>
      {messages.length > 0 ? (
        <div className={styles.notificationList}>
          {messages.map((message, index) => (
            <div key={index} className={styles.item}>
              <img
                src="/default-profile.png"
                alt="프로필"
                className={styles.messageIcon}
              />
              <div className={styles.textBox}>
                <div className={styles.text}>
                  <span className={styles.sender}>{message.sender}</span>
                  <span className={styles.date}>{message.date}</span>
                </div>
                <p className={styles.content}>{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <img src="/clover.png" alt="비어 있음" className={styles.emptyIcon} />
          <p>메시지가 없습니다.</p>
        </div>
      )}
      {messages.length > 0 && (
        <button className={styles.viewAll} onClick={handleClick}>
          모두 보기
        </button>
      )}
    </div>
  );
};

export default MessageDropdown;

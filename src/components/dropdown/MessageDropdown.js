import React from "react";
import styles from "../../styles/Dropdown.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MessageDropdown = ({ messages }) => {
  const navigate = useNavigate();
  const email = useSelector((state) => state.loginSlice.email);

  const handleClick = () => {
    navigate("/messages");
  };

  if (!email) {
    return (
      <div className={styles.dropdown}>
        <h3 className={styles.title}>메시지</h3>
        <div className={styles.empty}>
          <img src="/clover.png" alt="비어 있음" className={styles.emptyIcon} />
          <p>로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

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

      <button className={styles.viewAll} onClick={handleClick}>
        모두 보기
      </button>
    </div>
  );
};

export default MessageDropdown;

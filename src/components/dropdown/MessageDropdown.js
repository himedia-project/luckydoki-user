import React, { useEffect, useState } from "react";
import styles from "../../styles/Dropdown.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getChatRooms } from "../../api/ChatApi";

const MessageDropdown = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = useSelector((state) => state.loginSlice.email);
  const [messages, setMessages] = useState([]);

  // 메시지 목록 갱신을 위한 상태
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getChatRooms();
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch unread messages:", error);
      }
    };

    if (email) {
      fetchMessages();
    }
  }, [email, refreshTrigger]); // refreshTrigger 의존성 추가

  // 메시지 페이지에서는 드롭다운 숨기기
  if (location.pathname === "/message") {
    return null;
  }
  const handleViewAllClick = () => {
    navigate("/message");
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
                  <span className={styles.date}>
                    {new Date(message.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className={styles.content}>{message.lastMessage}</p>
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
      <button className={styles.viewAll} onClick={handleViewAllClick}>
        모두 보기
      </button>
    </div>
  );
};

export default MessageDropdown;

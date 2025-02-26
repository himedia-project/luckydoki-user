import React, { useEffect, useState } from "react";
import styles from "../../styles/Dropdown.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getChatRooms, getUnReadMessages } from "../../api/chatApi";
import { clearMessageItems } from "../../api/redux/messageSlice";

const MessageDropdown = ({ messages = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [unreadMessages, setUnreadMessages] = useState([]);
  const safeMessages = Array.isArray(messages) ? messages : [];

  console.log("MessageDropdown messages: ", safeMessages);

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
  // 메시지 목록 갱신을 위한 상태
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await getUnReadMessages();
        setUnreadMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch unread messages:", error);
      }
    };

    if (email) {
      fetchUnreadMessages();
    }
  }, [email]);

  // 메시지 페이지에서는 드롭다운 숨기기
  if (location.pathname === "/message") {
    return null;
  }
  const handleViewAllClick = () => {
    navigate("/message");
  };

  const handleClear = () => {
    dispatch(clearMessageItems());
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
        메시지
        {unreadMessages.length > 0 && (
          <button onClick={handleClear} className={styles.clearButton}>
            모두 지우기
          </button>
        )}
      </div>

      {unreadMessages.length === 0 ? (
        <div className={styles.empty}>
          <img src="/clover.png" alt="알림 없음" className={styles.emptyIcon} />
          <div className={styles.notNotice}>새로운 메시지가 없습니다.</div>
        </div>
      ) : (
        <div className={styles.notificationList}>
          {unreadMessages.map((message, index) => (
            <div key={index} className={styles.item}>
              <img
                src="/profile.png"
                alt="알림 아이콘"
                className={styles.icon}
              />
              <div className={styles.textBox}>
                <div className={styles.text}>
                  <span className={styles.category}>
                    {`Room ${message.roomId}`}
                  </span>
                  <span className={styles.date}>
                    {formatTime(message.sendTime)}
                  </span>
                </div>
                <div className={styles.content}>
                  <strong>{message.email}</strong>: {message.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className={styles.viewAll} onClick={handleViewAllClick}>
        모두 보기
      </button>
    </div>
  );
};

export default MessageDropdown;

import React, { useEffect, useState } from "react";
import styles from "../../styles/Dropdown.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { changeIsRead, getUnReadMessages } from "../../api/ChatApi";

const MessageDropdown = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = useSelector((state) => state.loginSlice.email);
  const [unreadMessages, setUnreadMessages] = useState([]);

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
  }, [email, refreshTrigger]); // refreshTrigger 의존성 추가

  const handleMessageClick = async (roomId) => {
    try {
      await changeIsRead(roomId);
      console.log("읽기 상태 변경 성공");

      // 상태 업데이트
      setUnreadMessages((prev) => prev.filter((msg) => msg.roomId !== roomId));
      // 강제 리프레시 트리거
      setRefreshTrigger((prev) => prev + 1);

      navigate("/message", { state: { selectedRoomId: roomId } });
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

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
      {unreadMessages.length > 0 ? (
        <div className={styles.notificationList}>
          {unreadMessages.map((message, index) => (
            <div
              key={index}
              className={styles.item}
              onClick={() => handleMessageClick(message.roomId)}
            >
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
                <p className={styles.content}>{message.notificationMessage}</p>
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

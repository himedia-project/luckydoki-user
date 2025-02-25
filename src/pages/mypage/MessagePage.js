import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styles from "../../styles/MessagePage.module.css";
import MessageDropdown from "../../components/dropdown/MessageDropdown";
import { useChatRoom } from "../../hooks/useChatRoom";
import { useWebSocket } from "../../hooks/useWebSocket";

import { API_URL } from "../../config/apiConfig";
import {
  createChattingRoom,
  getChatRooms,
  getMessageHistory,
} from "../../api/chatApi";

export default function MessagePage() {
  const location = useLocation();
  const routeShopData = location.state;
  const messagesEndRef = useRef(null);

  const [message, setMessage] = useState("");
  const [selectedShopId, setSelectedShopId] = useState(
    routeShopData?.shopId || null
  );
  const [unreadMessages, setUnreadMessages] = useState({});
  const [dropdownMessages, setDropdownMessages] = useState([]);

  const userEmail = useSelector((state) => state.loginSlice.email);
  const accessToken = useSelector((state) => state.loginSlice.accessToken);

  // 커스텀 훅 사용
  const {
    chatRooms,
    selectedRoom,
    roomId,
    realtimeMessages,
    setRealTimeMessage,
    handleRoomSelect,
    initializeChat,
  } = useChatRoom(userEmail, routeShopData);

  const { stompClient, connected, connect } = useWebSocket(
    userEmail,
    accessToken
  );

  // 웹소켓 자동 연결
  useEffect(() => {
    if (userEmail && accessToken && !connected) {
      connect({ preventDefault: () => {} }); // connect 함수가 e.preventDefault()를 사용하므로 더미 객체 전달
    }
  }, [userEmail, accessToken, connected]);

  // 알림 권한 요청
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // 채팅방 초기화
  useEffect(() => {
    initializeChat();
  }, [routeShopData, userEmail]);

  // 웹소켓 구독
  useEffect(() => {
    if (roomId && stompClient) {
      const subscription = stompClient.subscribe(
        `/topic/chat/message/${roomId}`,
        handleNewMessage
      );

      const notificationSubscription = stompClient.subscribe(
        `/user/queue/notifications/`,
        handleNotification
      );

      return () => {
        subscription.unsubscribe();
        notificationSubscription.unsubscribe();
      };
    }
  }, [roomId, stompClient, userEmail]);

  // 새 메시지 처리 함수
  const handleNewMessage = (message) => {
    const newMessage = JSON.parse(message.body);
    setRealTimeMessage((prevMessages) => [...prevMessages, newMessage]);

    // 메시지가 다른 사용자로부터 왔을 때만 알림
    if (newMessage.email !== userEmail) {
      // 브라우저 알림
      if (Notification.permission === "granted" && document.hidden) {
        new Notification("새 메시지가 도착했습니다", {
          body: newMessage.message,
        });
      }

      // 읽지 않은 메시지 카운트 업데이트
      setUnreadMessages((prev) => ({
        ...prev,
        [roomId]: (prev[roomId] || 0) + 1,
      }));
    }

    // 자동 스크롤
    scrollToBottom();
  };

  // 알림 처리 함수
  const handleNotification = (notification) => {
    const newNotification = JSON.parse(notification.body);
    setDropdownMessages((prev) => [...prev, newNotification]);

    // 브라우저 알림
    if (Notification.permission === "granted" && document.hidden) {
      new Notification("새 알림이 도착했습니다", {
        body: newNotification.message,
      });
    }
  };

  // 스크롤 자동 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 메시지 전송 함수
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !stompClient || !connected) return;

    const chatMessage = {
      roomId: roomId,
      email: userEmail,
      shopId: selectedShopId,
      message: message.trim(),
      sendTime: new Date().toISOString(),
    };

    stompClient.publish({
      destination: "/app/message",
      headers: { "X-Authorization": `Bearer ${accessToken}` },
      body: JSON.stringify(chatMessage),
    });

    setMessage("");
  };

  return (
    <div className={styles.messagePageContainer}>
      {/* MessageDropdown 컴포넌트 추가 */}
      <MessageDropdown messages={dropdownMessages} />

      <div className={styles.messagePageContainer}>
        {/* 왼쪽 사이드바 - 채팅방 목록 */}
        <div className={styles.chatRoomList}>
          {chatRooms && chatRooms.length > 0 ? (
            chatRooms.map((room) =>
              room && room.id ? ( // room과 room.id가 있는지 확인
                <div
                  key={room.id}
                  className={`${styles.chatRoomItem} ${
                    selectedRoom?.id === room.id ? styles.selected : ""
                  }`}
                  onClick={() => handleRoomSelect(room)}
                >
                  <div className={styles.shopImage}>
                    <img
                      src={room.shopImage || ""}
                      alt={room.shopName || "상점 이미지"}
                    />
                  </div>
                  <div className={styles.roomInfo}>
                    <h3>{room.sender}</h3>
                    <p className={styles.lastMessage}>
                      {room.lastMessage || "메시지가 없습니다"}
                    </p>
                    <span className={styles.messageTime}>
                      {room.lastMessageTime
                        ? new Date(room.lastMessageTime).toLocaleString()
                        : ""}
                    </span>
                    <span className={styles.unreadCount}>
                      {unreadMessages[room.id] > 0 &&
                        `(${unreadMessages[room.id]} 새 메시지)`}
                    </span>
                  </div>
                </div>
              ) : null
            )
          ) : (
            <div className={styles.noChatRooms}>채팅방이 없습니다.</div>
          )}
        </div>

        {/* 오른쪽 - 채팅 영역 */}
        <div className={styles.chatArea}>
          {selectedRoom || (routeShopData && roomId) ? (
            <>
              <div className={styles.messagesContainer}>
                {realtimeMessages.map((msg, index) => (
                  <div
                    key={`${msg.sendTime}-${index}`}
                    className={`${styles.messageItem} ${
                      msg.email === userEmail
                        ? styles.messageItemRight
                        : styles.messageItemLeft
                    }`}
                  >
                    <div
                      className={`${styles.messageContent} ${
                        msg.email === userEmail
                          ? styles.messageSent
                          : styles.messageReceived
                      }`}
                    >
                      <p>{msg.message}</p>
                      <small className={styles.messageTime}>
                        {new Date(msg.sendTime).toLocaleTimeString()}
                      </small>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className={styles.messageForm}>
                <form
                  onSubmit={sendMessage}
                  className={styles.messageInputContainer}
                >
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={styles.messageInput}
                    placeholder="메시지를 입력하세요..."
                  />
                  <button
                    type="submit"
                    className={styles.sendButton}
                    disabled={!connected}
                  >
                    전송
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className={styles.noChatSelected}>채팅방을 선택해주세요</div>
          )}
        </div>
      </div>
    </div>
  );
}

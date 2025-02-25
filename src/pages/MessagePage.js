import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styles from "../styles/MessagePage.module.css";
import MessageDropdown from "../components/dropdown/MessageDropdown";
import { useWebSocket } from "../hooks/useWebSocket";
import { useChatRoom } from "../hooks/useChatRoom";

export default function MessagePage() {
  const location = useLocation();
  const routeShopData = location.state;
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [unreadMessages, setUnreadMessages] = useState({});
  const [dropdownMessages, setDropdownMessages] = useState([]);

  const userEmail = useSelector((state) => state.loginSlice.email);
  const accessToken = useSelector((state) => state.loginSlice.accessToken);

  const { stompClient, connected, connect } = useWebSocket(
    userEmail,
    accessToken
  );
  const {
    chatRooms,
    selectedRoom,
    roomId,
    realtimeMessages,
    setRealTimeMessage,
    handleRoomSelect,
    initializeChat,
  } = useChatRoom(userEmail, routeShopData);

  // 알림 및 구독 관련 useEffect
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    initializeChat();
  }, [routeShopData]);

  // 메시지 구독
  useEffect(() => {
    if (roomId && stompClient) {
      const subscription = stompClient.subscribe(
        `/topic/chat/message/${roomId}`,
        (message) => {
          const receivedMessage = JSON.parse(message.body);
          handleNewMessage(receivedMessage);
        }
      );
    }
  }, [roomId, stompClient]);

  // ... 나머지 필요한 함수들 (sendMessage, handleNewMessage 등)
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    stompClient.send(`/app/chat/send/${roomId}`, {}, message);
    setMessage("");
  };

  const handleNewMessage = (message) => {
    console.log("받은 메시지 : ", message);
    // 자신이 보낸 메시지가 아닐 때만 알림 표시
    if (message.email !== userEmail) {
      if (Notification.permission === "granted") {
        new Notification("새 메시지 도착", {
          body: message.message,
        });
      }

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
                <div className={styles.noChatSelected}>
                  채팅방을 선택해주세요
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  };
}

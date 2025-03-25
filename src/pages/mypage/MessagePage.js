import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/MessagePage.module.css";

import { ChatArea } from "../../components/chat/ChatArea";
import ChatRoomList from "../../components/chat/ChatRoomList";
import useChatRoom from "../../hooks/useChatRoom";
import useWebSocket from "../../hooks/useWebSocket";
import { formatDateTime } from "../../utils/dateUtils";

export default function MessagePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeShopData = location.state;
  const userEmail = useSelector((state) => state.loginSlice.email);
  const accessToken = useSelector((state) => state.loginSlice.accessToken);

  // useChatRoom 훅 사용
  const {
    selectedShopId,
    setSelectedShopId,
    realTimeMessages,
    setRealTimeMessages,
    roomId,
    setRoomId,
    chatRooms,
    setChatRooms,
    selectedRoom,
    setSelectedRoom,
    unreadMessages,
    setUnreadMessages,
    initializeChat,
    handleRoomSelect,
    handleLeaveRoom,
  } = useChatRoom(userEmail, routeShopData);

  const {
    connected,
    connect,
    subscribe,
    sendMessage: sendWebSocketMessage,
  } = useWebSocket(userEmail, accessToken);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  // 알림 권한 요청 useEffect
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // 초기화 useEffect 수정
  useEffect(() => {
    const init = async () => {
      await initializeChat();
      if (routeShopData?.shopId) {
        // routeShopData가 있는 경우에만 자동 연결
        const event = { preventDefault: () => {} };
        connect(event);
      }
    };

    init();
  }, [routeShopData, userEmail]);

  //////////구독시저ㅁ///// 그방을 선택해서 들어갈 때 연결(구독)

  useEffect(() => {
    if (roomId) {
      const subscription = subscribe(roomId, (receivedMessage) => {
        console.log("받은 메세지 : ", receivedMessage);

        setRealTimeMessages((prevMessages) => {
          const isDuplicate = prevMessages.some(
            (msg) =>
              msg.sendTime === receivedMessage.sendTime &&
              msg.message === receivedMessage.message &&
              msg.email === receivedMessage.email
          );

          if (isDuplicate) return prevMessages;
          return [...prevMessages, receivedMessage];
        });

        // 채팅방 목록 업데이트
        setChatRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.id === roomId
              ? {
                  ...room,
                  lastMessage: receivedMessage.message,
                  lastMessageTime: receivedMessage.sendTime,
                }
              : room
          )
        );

        // 자신이 보낸 메시지가 아닐 때만 알림 표시
        if (receivedMessage.email !== userEmail) {
          if (Notification.permission === "granted") {
            new Notification("새 메시지 도착", {
              body: receivedMessage.message,
            });
          }

          // 읽지 않은 메시지 카운트 증가
          setUnreadMessages((prev) => ({
            ...prev,
            [roomId]: (prev[roomId] || 0) + 1,
          }));
        }
      });

      // 구독 해제
      return () => {
        if (subscription) {
          console.log("구독 해제");
          subscription.unsubscribe();
        }
      };
    }
  }, [roomId, userEmail, subscribe]);
  /////////채팅방 선택/////////////

  ////////스크롤 이벤트 (좀 과하게 내려감)//////
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // scrollIntoView 대신 부모 컨테이너의 scrollTop 속성 사용
      const messagesContainer = document.querySelector(
        `.${styles.messagesContainer}`
      );
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  };

  // 메시지 수신 시 스크롤 처리
  useEffect(() => {
    if (realTimeMessages.length > 0) {
      const lastMessage = realTimeMessages[realTimeMessages.length - 1];
      // 내가 보낸 메시지일 경우에만 스크롤 다운
      if (lastMessage.email === userEmail) {
        scrollToBottom();
      }
    }
  }, [realTimeMessages, userEmail]);

  // 샵 페이지로 이동하는 함수 추가
  const navigateToShop = () => {
    if (selectedRoom?.shopId) {
      navigate(`/shop/${selectedRoom.shopId}`);
    }
  };

  // handleRoomSelect 함수 수정
  const handleRoomSelectWithConnect = async (room) => {
    await handleRoomSelect(room);

    // WebSocket 연결 실행
    const event = { preventDefault: () => {} };
    connect(event);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!connected || !selectedShopId) {
      console.log("연결 실패");
      console.log("connected:", connected);
      console.log("selectedShopId:", selectedShopId);
      return;
    }

    if (!message.trim()) {
      console.log("메시지가 없습니다.");
      return;
    }

    const currentTime = formatDateTime(new Date());
    const chatMessage = {
      roomId: roomId,
      sender: null,
      email: userEmail,
      shopId: selectedShopId,
      message: message.trim(),
      sendTime: currentTime,
    };

    const success = sendWebSocketMessage("/app/message", chatMessage);

    if (success) {
      setChatRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === roomId
            ? {
                ...room,
                lastMessage: message.trim(),
                lastMessageTime: currentTime,
              }
            : room
        )
      );

      setMessage("");
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <div className={styles.messagePageContainer}>
      <div className={styles.messagePageContainer}>
        <ChatRoomList
          chatRooms={chatRooms}
          selectedRoom={selectedRoom}
          unreadMessages={unreadMessages}
          onRoomSelect={handleRoomSelectWithConnect}
        />

        <ChatArea
          selectedRoom={selectedRoom}
          routeShopData={routeShopData}
          roomId={roomId}
          realTimeMessages={realTimeMessages}
          userEmail={userEmail}
          messagesEndRef={messagesEndRef}
          message={message}
          setMessage={setMessage}
          connected={connected}
          onNavigateToShop={navigateToShop}
          onLeaveRoom={handleLeaveRoom}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

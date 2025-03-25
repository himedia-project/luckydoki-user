import { Client } from "@stomp/stompjs";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import styles from "../../styles/MessagePage.module.css";

import ImageLoader from "../../components/card/ImageLoader";
import { API_URL } from "../../config/apiConfig";
import { formatDateTime, formatTimeOnly } from "../../utils/dateUtils";
import useChatRoom from "../../hooks/useChatRoom";

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

  const [stompClient, setStompClient] = useState(null);
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);
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
    if (roomId && stompClient) {
      console.log("구독 시작 - roomId, stompClient :", roomId, stompClient);
      const subscription = stompClient.subscribe(
        `/topic/chat/message/${roomId}`,
        (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log("받은 메세지 : ", receivedMessage);

          // 중복 메시지 방지를 위한 체크
          setRealTimeMessages((prevMessages) => {
            // 이미 같은 메시지가 있는지 확인
            const isDuplicate = prevMessages.some(
              (msg) =>
                msg.sendTime === receivedMessage.sendTime &&
                msg.message === receivedMessage.message &&
                msg.email === receivedMessage.email
            );

            if (isDuplicate) {
              return prevMessages;
            }

            const newMessages = [...prevMessages, receivedMessage];

            // 메시지가 추가된 후 스크롤 조정 코드 제거
            // 자동 스크롤 없이 메시지만 추가

            return newMessages;
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
        }
      );

      // 구독 해제
      return () => {
        if (subscription) {
          console.log("구독 해제");
          subscription.unsubscribe();
        }
      };
    }
  }, [roomId, stompClient, userEmail]);
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

  useEffect(() => {
    return () => {
      //연결 종료 및 정리 함수
      if (stompClient && typeof stompClient.deactivate === "function") {
        try {
          stompClient.deactivate();
          setStompClient(null);
          setConnected(false);
        } catch (error) {
          console.error("연결종료 에러 발생", error);
        }
      }
    };
  }, [stompClient]);

  //소캣 연결 함수
  // 2. 소켓 연결 함수, 계속 유지 언제?
  const connect = (e) => {
    e.preventDefault();
    if (userEmail && !connected) {
      console.log("소켓 연결 시작");
      console.log("API_URL:", API_URL); // URL 확인
      console.log("토큰 존재 여부:", !!accessToken); // 토큰 존재 확인

      const client = new Client({
        webSocketFactory: () => new SockJS(`${API_URL}/wss-stomp`),
        connectHeaders: {
          // 서버의 WebSocketAuthChannelInterceptor와 일치하도록 헤더 수정
          "X-Authorization": `Bearer ${accessToken}`,
        },
        debug: (str) => {
          console.log("STOMP Debug:", str); // 디버그 로그 추가
        },
        reconnectDelay: 5000, // 5초 후 재연결
        heartbeatIncoming: 4000, //
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("socket 연결 완료");
          setConnected(true);
          setStompClient(client);
        },
        onWebSocketError: (error) => {
          console.error("WebSocket 에러:", error);
          if (!userEmail) {
            console.log("로그인이 필요합니다. 재연결을 중단합니다.");
            client.deactivate();
          }
        },
        onDisconnect: () => {
          console.log("Disconnected from STOMP");
          setConnected(false);
          setStompClient(null);

          if (userEmail) {
            console.log("재연결 시도...");
          } else {
            console.log("로그인이 필요하여 재연결을 중단합니다.");
          }
        },
        onStompError: (frame) => {
          console.error("Broker reported error:", frame.headers["message"]);
          console.error("Additional details:", frame.body);
        },
      });

      try {
        console.log("연결 시도 중...");
        client.activate();
      } catch (error) {
        console.error("연결 에러:", error);
        setConnected(false);
        setStompClient(null);
      }
    }
  };
  //메세지 전송 함수(connect 함수 호출 필요)
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!connected || !stompClient || !selectedShopId) {
      console.error("연결 상태:", connected);
      console.error("STOMP 클라이언트 존재:", !!stompClient);
      console.error("선택된 상점:", selectedShopId);
      return;
    }

    if (!message.trim()) {
      return;
    }

    try {
      const currentTime = formatDateTime(new Date());
      const chatMessage = {
        roomId: roomId,
        sender: null,
        email: userEmail,
        shopId: selectedShopId,
        message: message.trim(),
        sendTime: currentTime,
      };

      console.log("전송 메세지:", chatMessage);

      if (!stompClient.connected) {
        console.error("STOMP 연결이 끊어졌습니다. 재연결을 시도합니다.");
        connect({ preventDefault: () => {} });
        return;
      }

      // 메세지 전송
      stompClient.publish({
        destination: "/app/message",
        headers: {
          "X-Authorization": `Bearer ${accessToken}`, // 헤더 이름 수정
        },
        body: JSON.stringify(chatMessage),
      });

      // 채팅방 목록에서 해당 방의 마지막 메시지 업데이트
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

      // 메시지 전송 후 채팅창 내부만 스크롤 다운
      // setTimeout을 사용하여 메시지가 DOM에 추가된 후 스크롤
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error("메시지 전송 중 에러 발생:", error);
    }
  };

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

  return (
    <div className={styles.messagePageContainer}>
      {/* MessageDropdown 컴포넌트 추가 */}
      {/* <MessageDropdown messages={dropdownMessages} /> */}

      <div className={styles.messagePageContainer}>
        {/* 왼쪽 사이드바 - 채팅방 목록 */}
        <div className={styles.chatRoomList}>
          {chatRooms && chatRooms.length > 0 ? (
            chatRooms.map((room) =>
              room && room.id ? (
                <div
                  key={room.id}
                  className={`${styles.chatRoomItem} ${
                    selectedRoom?.id === room.id ? styles.selected : ""
                  }`}
                  onClick={() => handleRoomSelectWithConnect(room)}
                >
                  <div className={styles.shopImage}>
                    <ImageLoader
                      imagePath={room.shopImage}
                      className={styles.shopImage}
                    />
                  </div>
                  <div className={styles.roomInfo}>
                    <h3>{room.sender}</h3>
                    <p className={styles.lastMessage}>
                      {room.lastMessage || "메시지가 없습니다"}
                    </p>
                    <span className={styles.messageTime}>
                      {room.lastMessageTime
                        ? formatTimeOnly(room.lastMessageTime)
                        : ""}
                    </span>
                    <span className={styles.unreadCount}>
                      {unreadMessages[room.id] > 0
                        ? `(${unreadMessages[room.id]} 새 메시지)`
                        : 0}
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
              <div className={styles.chatHeader}>
                <div
                  className={styles.partnerInfo}
                  onClick={navigateToShop}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.partnerImage}>
                    <ImageLoader
                      imagePath={selectedRoom?.shopImage}
                      className={styles.partnerImage}
                    />
                  </div>
                  <div className={styles.partnerDetails}>
                    <h3>
                      {selectedRoom?.shopName}
                      <span
                        className={styles.shopIcon}
                        style={{ marginLeft: "5px" }}
                      >
                        🏠
                      </span>
                    </h3>
                  </div>
                  <button
                    className={styles.leaveButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLeaveRoom(selectedRoom.id);
                    }}
                  >
                    나가기
                  </button>
                </div>
              </div>
              <div className={styles.messagesContainer}>
                {realTimeMessages.map((msg, index) => (
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
                        {formatTimeOnly(msg.sendTime)}
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
                    onClick={sendMessage}
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

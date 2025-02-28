import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styles from "../../styles/MessagePage.module.css";

import {
  createChattingRoom,
  getMessageHistory,
  getChatRooms,
  deleteChatRooms,
  changeIsRead,
} from "../../api/chatApi";
import { API_URL } from "../../config/apiConfig";
import MessageDropdown from "../../components/dropdown/MessageDropdown";
import axiosInstance from "../../api/axiosInstance";
import ImageLoader from "../../components/card/ImageLoader";

export default function MessagePage() {
  const location = useLocation();
  const routeShopData = location.state;

  const [selectedShopId, setSelectedShopId] = useState(
    routeShopData?.shopId || null
  );
  const [realTimeMessages, setRealTimeMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const messagesEndRef = useRef(null);

  const userEmail = useSelector((state) => state.loginSlice.email);
  const accessToken = useSelector((state) => state.loginSlice.accessToken);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({}); // 읽지 않은 메시지 수 관리

  const [dropdownMessages, setDropdownMessages] = useState([]);

  // 알림 권한 요청 useEffect
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // 드롭다운 메시지 생성 useEffect 추가,
  // useEffect(() => {
  //   // 읽지 않은 메시지가 있는 채팅방을 기반으로 드롭다운 메시지 생성
  //   const newDropdownMessages = Object.entries(unreadMessages)
  //     .filter(([roomId, count]) => count > 0)
  //     .map(([roomId, count]) => {
  //       // 해당 roomId의 채팅방 찾기
  //       const room = chatRooms.find((r) => r.id === parseInt(roomId));

  //       return {
  //         sender: room ? room.shopName : "알 수 없는 상점",
  //         date: new Date().toLocaleDateString(),
  //         content: `${count}개의 새 메시지가 있습니다.`,
  //         lastMessage: room ? room.lastMessage : "새 메시지",
  //       };
  //     });

  //   setDropdownMessages(newDropdownMessages);
  // }, [unreadMessages, chatRooms]);

  // 기존의 다른 useEffect, 함수들은 그대로 유지

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // 먼저 모든 채팅방 목록을 가져옴
        // 1.
        console.log("routeShopData:", routeShopData); // 데이터 확인
        console.log("shopId:", routeShopData?.shopId); // shopId 확인

        const response = await getChatRooms();
        console.log("채팅방 목록:", response.data); // 채팅방 목록 확인
        setChatRooms(response.data);

        // route로 shopId를 전달받은 경우만 채팅방 생성/조회 로직 실행
        if (routeShopData?.shopId) {
          setSelectedShopId(routeShopData.shopId);
          // 이미 존재하는 채팅방인지 채팅방 목록에서 확인
          const existingRoom = response.data.find((room) => {
            console.log("비교:", room.shopId, routeShopData.shopId); // 비교 값 확인
            return parseInt(room.shopId) === parseInt(routeShopData.shopId);
          });

          console.log("찾은 채팅방:", existingRoom); // 찾은 채팅방 확인

          if (existingRoom) {
            // 기존 채팅방이 있는 경우
            setRoomId(existingRoom.id);
            setSelectedRoom(existingRoom);
            const historyResponse = await getMessageHistory(existingRoom.id);
            setRealTimeMessages(historyResponse.data);
          } else {
            // 새로운 채팅방 생성
            const chatRoomData = {
              id: null,
              member: userEmail,
              shopId: routeShopData.shopId,
              shopImage: routeShopData.shopImage,
              shopName: routeShopData.shopName,
              lastMessage: null,
              createdAt: new Date().toISOString(),
            };

            const newRoomResponse = await createChattingRoom(chatRoomData);
            const newRoom = newRoomResponse.data;
            setRoomId(newRoom.id);
            setSelectedRoom(newRoom);
            setRealTimeMessages([]);
            setChatRooms((prev) =>
              Array.isArray(prev) ? [...prev, newRoom] : [newRoom]
            );
          }

          // routeShopData가 있는 경우에만 자동 연결
          const event = { preventDefault: () => {} };
          connect(event);
        }
        // routeShopData가 없는 경우(마이페이지에서 진입)는
        // 채팅방 목록만 표시하고 사용자가 선택하기를 기다림
      } catch (error) {
        console.error("채팅방 초기화 실패:", error);
      }
    };

    initializeChat();
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

            // 메시지가 추가된 후 스크롤 조정
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 50);

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

  const handleRoomSelect = async (room) => {
    setSelectedRoom(room);
    setSelectedShopId(room.shopId);
    setRoomId(room.id);

    setUnreadMessages((prev) => ({
      ...prev,
      [room.id]: 0,
    }));

    try {
      const historyResponse = await getMessageHistory(room.id);
      setRealTimeMessages(historyResponse.data);
      console.log("채팅기록 response:", historyResponse.data);

      // 읽기로 바꾸기
      await changeIsRead(room.id);

      // 빈 preventDefault 대신 실제 이벤트 객체 생성
      const event = new Event("connect");
      event.preventDefault = () => {}; // 기본 동작 방지 함수 추가

      // WebSocket 연결 실행
      connect(event);
    } catch (error) {
      console.error("채팅 기록 불러오기 실패:", error);
    }
  };

  ////////스크롤 이벤트 (좀 과하게 내려감)//////
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [realTimeMessages]);

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
    if (userEmail && !stompClient) {
      console.log("소켓 연결 시작");
      const client = new Client({
        webSocketFactory: () => new SockJS(`${API_URL}/wss-stomp`),
        connectHeaders: {
          "X-Authorization": `Bearer ${accessToken}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("socket 연결 완료 ");
          setConnected(true);
          setStompClient(client);
        },
        onDisconnect: () => {
          console.log("Disconnected from STOMP");
          setConnected(false);
          setStompClient(null);
        },
        onStompError: (frame) => {
          console.error("Broker reported error:", frame.headers["message"]);
          console.error("Additional details:", frame.body);
        },
      });

      try {
        client.activate();
        console.log("Attempting to connect...");
      } catch (error) {
        console.error("Error activating STOMP client:", error);
      }
    }
  };
  function formatDate(date) {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  //메세지 전송 함수(connect 함수 호출 필요)
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!stompClient || !selectedShopId) {
      console.error("STOMP 클라이언트 또는 ShopId가 없습니다.");
      return;
    }

    if (!message.trim()) {
      return;
    }

    try {
      // roomId가 없는 경우, 채팅방 생성 필요
      if (!roomId) {
        // 먼저 기존 채팅방이 있는지 확인
        const existingRoom = chatRooms.find((room) => {
          console.log(
            "room.shopId 타입:",
            typeof room.shopId,
            "값:",
            room.shopId
          );
          console.log(
            "routeShopData.shopId 타입:",
            typeof routeShopData.shopId,
            "값:",
            routeShopData.shopId
          );

          // 문자열로 변환 후 비교
          return String(room.shopId) === String(routeShopData.shopId);
        });

        if (existingRoom) {
          setRoomId(existingRoom.id);
          setSelectedRoom(existingRoom);
        } else {
          // 채팅룸이 없으면 selectedShopId 로 채팅룸 생성
          const chatRoomData = {
            id: null,
            sender: userEmail,
            shopId: selectedShopId,
            shopImage: routeShopData?.shopImage,
            shopName: routeShopData?.shopName,
            lastMessage: null,
            lastMessageTime: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          };

          const newRoomResponse = await createChattingRoom(chatRoomData);
          const newRoom = newRoomResponse.data;
          setRoomId(newRoom.id);
          setSelectedRoom(newRoom);
          setChatRooms((prev) =>
            Array.isArray(prev) ? [...prev, newRoom] : [newRoom]
          );
        }
      }

      // const currentTime = new Date().toISOString();
      // "2025-02-28 11:35:34"
      const currentTime = formatDate(new Date());
      const chatMessage = {
        roomId: roomId || selectedRoom?.id,
        sender: null,
        email: userEmail,
        shopId: selectedShopId,
        message: message.trim(),
        sendTime: currentTime,
      };

      console.log("전송 메세지:", chatMessage);

      if (!stompClient.connected) {
        console.error("STOMP 연결이 끊어졌습니다. 재연결을 시도합니다.");
        connect(e);
        return;
      }

      // 메세지 전송
      stompClient.publish({
        destination: "/app/message",
        headers: {
          "X-Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(chatMessage),
      });

      // 메시지 전송 직후 즉시 상태 업데이트
      // setRealTimeMessages((prevMessages) => [...prevMessages, chatMessage]);

      // 채팅방 목록에서 해당 방의 마지막 메시지 업데이트
      setChatRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === (roomId || selectedRoom?.id)
            ? {
                ...room,
                lastMessage: message.trim(),
                lastMessageTime: currentTime,
              }
            : room
        )
      );

      setMessage("");
    } catch (error) {
      console.error("메시지 전송 중 에러 발생:", error);
    }
  };

  // handleLeaveRoom 함수 추가
  const handleLeaveRoom = async () => {
    if (!selectedRoom) return;

    try {
      await deleteChatRooms(selectedRoom.id);
      // 채팅방 목록에서 제거
      setChatRooms((prev) =>
        prev.filter((room) => room.id !== selectedRoom.id)
      );
      // 선택된 채팅방 초기화
      setSelectedRoom(null);
      setRoomId(null);
      setRealTimeMessages([]);

      // WebSocket 연결 해제
      if (stompClient) {
        stompClient.deactivate();
        setStompClient(null);
        setConnected(false);
      }
    } catch (error) {
      console.error("채팅방 나가기 실패:", error);
    }
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
              room && room.id ? ( // room과 room.id가 있는지 확인
                <div
                  key={room.id}
                  className={`${styles.chatRoomItem} ${
                    selectedRoom?.id === room.id ? styles.selected : ""
                  }`}
                  onClick={() => handleRoomSelect(room)}
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
                        ? new Date(room.lastMessageTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
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
                <div className={styles.partnerInfo}>
                  <div className={styles.partnerImage}>
                    <ImageLoader
                      imagePath={selectedRoom?.shopImage}
                      className={styles.partnerImage}
                    />
                  </div>
                  <div className={styles.partnerDetails}>
                    <h3>{selectedRoom?.shopName}</h3>
                  </div>
                  <button
                    className={styles.leaveButton}
                    onClick={handleLeaveRoom}
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
                        {new Date(msg.lastMessageTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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

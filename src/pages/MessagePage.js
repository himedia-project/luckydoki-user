import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styles from "../styles/MessagePage.module.css";
import {
  createChattingRoom,
  getMessageHistory,
  getChatRooms,
} from "../api/ChatApi";

export default function MessagePage() {
  const location = useLocation();
  const routeShopData = location.state;

  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(
    routeShopData?.shopId || null
  );
  const [realtimeMessages, setRealTimeMessage] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const messagesEndRef = useRef(null);

  const userEmail = useSelector((state) => state.loginSlice.email);
  const accessToken = useSelector((state) => state.loginSlice.accessToken);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // 먼저 모든 채팅방 목록을 가져옴

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
            setRealTimeMessage(historyResponse.data);
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
            setRealTimeMessage([]);
            setChatRooms((prev) => [...prev, newRoom]);
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

  //////////구독시저ㅁ/////
  useEffect(() => {
    if (roomId && stompClient) {
      console.log("구독 시작 - roomId:", roomId);
      const subscription = stompClient.subscribe(
        `/topic/chat/message/${roomId}`,
        (message) => {
          const receivedMessage = JSON.parse(message.body);
          // 기존 메시지 목록에 새 메시지 추가
          console.log("받은 메세지 : ", receivedMessage);
          setRealTimeMessage((prevMessages) => [
            ...prevMessages,
            receivedMessage,
          ]);
        }
      );

      // cleanup
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [roomId, stompClient]);

  // useEffect(() => {
  //   const fetchChatRooms = async () => {
  //     try {
  //       console.log("현재 이메일:", userEmail); // email 확인
  //       console.log("현재 토큰:", accessToken);
  //       const response = await getChatRooms();
  //       setChatRooms(response.data);
  //     } catch (error) {
  //       console.error("채팅방 목록 불러오기 실패:", error);
  //     }
  //   };

  //   fetchChatRooms();
  // }, []);

  const handleRoomSelect = async (room) => {
    setSelectedRoom(room);
    setSelectedShopId(room.shopId);
    setRoomId(room.id);

    try {
      const historyResponse = await getMessageHistory(room.id);
      setRealTimeMessage(historyResponse.data);
      console.log("채팅기록 response:", historyResponse.data);
      const event = { preventDefault: () => {} };
      connect(event);
    } catch (error) {
      console.error("채팅 기록 불러오기 실패:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [realtimeMessages]);

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
  const connect = (e) => {
    e.preventDefault();
    if (userEmail && !stompClient) {
      const client = new Client({
        webSocketFactory: () => new SockJS("http://3.34.99.192:8080/ws-stomp"),
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
  //메세지 전송 함수
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
        const existingRoom = chatRooms.find(
          (room) => room.shopId === selectedShopId
        );

        if (existingRoom) {
          setRoomId(existingRoom.id);
          setSelectedRoom(existingRoom);
        } else {
          // 채팅룸이 없으면 selectedShopId 로 채팅룸 생성
          const chatRoomData = {
            id: null,
            member: userEmail,
            shopId: selectedShopId,
            shopImage: routeShopData?.shopImage,
            shopName: routeShopData?.shopName,
            lastMessage: null,
            createdAt: new Date().toISOString(),
          };

          const newRoomResponse = await createChattingRoom(chatRoomData);
          const newRoom = newRoomResponse.data;
          setRoomId(newRoom.id);
          setSelectedRoom(newRoom);
          setChatRooms((prev) => [...prev, newRoom]);
        }
      }

      const chatMessage = {
        roomId: roomId || selectedRoom?.id,
        sender: null, //보내는 사람의 이메일
        email: userEmail,
        shopId: selectedShopId,
        message: message.trim(),
        sendTime: new Date().toISOString(),
      };

      console.log("전송 메세지:", chatMessage);

      if (!stompClient.connected) {
        console.error("STOMP 연결이 끊어졌습니다. 재연결을 시도합니다.");
        connect(e);
        return;
      }

      stompClient.publish({
        destination: "/app/message",
        headers: { "X-Authorization": `Bearer ${accessToken}` },
        body: JSON.stringify(chatMessage),
      });

      setMessage("");
    } catch (error) {
      console.error("메시지 전송 중 에러 발생:", error);
    }
  };

  return (
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
                  <h3>{room.shopName || "상점"}</h3>
                  <p className={styles.lastMessage}>
                    {room.lastMessage || "메시지가 없습니다"}
                  </p>
                  <span className={styles.messageTime}>
                    {room.lastMessageTime
                      ? new Date(room.lastMessageTime).toLocaleString()
                      : ""}
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
  );
}

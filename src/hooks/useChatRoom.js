import { useState, useEffect } from "react";
import {
  getChatRooms,
  createChattingRoom,
  getMessageHistory,
} from "../api/chatApi";

export const useChatRoom = (userEmail, routeShopData) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [realtimeMessages, setRealTimeMessage] = useState([]);

  // 채팅방 초기화
  const initializeChat = async () => {
    try {
      // 채팅방 목록 조회
      const response = await getChatRooms();
      setChatRooms(response.data);

      if (routeShopData?.shopId) {
        const existingRoom = response.data.find(
          (room) => parseInt(room.shopId) === parseInt(routeShopData.shopId)
        );

        // 기존 채팅방이 있으면 선택, 없으면 생성
        if (existingRoom) {
          // 채팅방 선택
          await handleRoomSelect(existingRoom);
        } else {
          // 채팅방 생성
          await createNewRoom(routeShopData);
        }
      }
    } catch (error) {
      console.error("채팅방 초기화 실패:", error);
    }
  };

  // 채팅방 선택
  const handleRoomSelect = async (room) => {
    setSelectedRoom(room);
    setRoomId(room.id);
    // 채팅방 메시지 조회
    const historyResponse = await getMessageHistory(room.id);
    setRealTimeMessage(historyResponse.data);
    return room.id;
  };

  // 새로운 채팅방 생성
  const createNewRoom = async (shopData) => {
    const chatRoomData = {
      member: userEmail,
      shopId: shopData.shopId,
      shopImage: shopData.shopImage,
      shopName: shopData.shopName,
    };

    const newRoomResponse = await createChattingRoom(chatRoomData);
    const newRoom = newRoomResponse.data;
    setRoomId(newRoom.id);
    setSelectedRoom(newRoom);
    setRealTimeMessage([]);
    setChatRooms((prev) => [...prev, newRoom]);
    return newRoom.id;
  };

  return {
    chatRooms,
    selectedRoom,
    roomId,
    realtimeMessages,
    setRealTimeMessage,
    handleRoomSelect,
    createNewRoom,
    initializeChat,
  };
};

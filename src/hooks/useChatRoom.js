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

  const initializeChat = async () => {
    try {
      const response = await getChatRooms();
      setChatRooms(response.data);

      if (routeShopData?.shopId) {
        const existingRoom = response.data.find(
          (room) => parseInt(room.shopId) === parseInt(routeShopData.shopId)
        );

        if (existingRoom) {
          await handleRoomSelect(existingRoom);
        } else {
          await createNewRoom(routeShopData);
        }
      }
    } catch (error) {
      console.error("채팅방 초기화 실패:", error);
    }
  };

  const handleRoomSelect = async (room) => {
    setSelectedRoom(room);
    setRoomId(room.id);
    const historyResponse = await getMessageHistory(room.id);
    setRealTimeMessage(historyResponse.data);
    return room.id;
  };

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

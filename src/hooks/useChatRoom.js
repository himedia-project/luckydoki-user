import { useState } from "react";
import {
  changeIsRead,
  createChattingRoom,
  deleteChatRooms,
  getChatRooms,
  getMessageHistory,
} from "../api/chatApi";

const useChatRoom = (userEmail, routeShopData) => {
  const [selectedShopId, setSelectedShopId] = useState(
    routeShopData?.shopId || null
  );
  const [realTimeMessages, setRealTimeMessages] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});

  const initializeChat = async () => {
    try {
      const response = await getChatRooms();
      setChatRooms(response.data);

      if (routeShopData?.shopId) {
        setSelectedShopId(routeShopData.shopId);
        const existingRoom = response.data.find(
          (room) => parseInt(room.shopId) === parseInt(routeShopData.shopId)
        );

        if (existingRoom) {
          setSelectedRoom(existingRoom);
          setRoomId(existingRoom.id);
          const historyResponse = await getMessageHistory(existingRoom.id);
          setRealTimeMessages(historyResponse.data);
        } else {
          // createChattingRoom API 호출을 위한 데이터 구성
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
      }
    } catch (error) {
      console.error("채팅방 초기화 실패:", error);
    }
  };

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
      await changeIsRead(room.id);
    } catch (error) {
      console.error("채팅 기록 불러오기 실패:", error);
    }
  };

  const handleLeaveRoom = async (roomId) => {
    try {
      await deleteChatRooms(roomId);
      setChatRooms((prev) => prev.filter((room) => room.id !== roomId));
      setSelectedRoom(null);
      setRoomId(null);
      setRealTimeMessages([]);
    } catch (error) {
      console.error("채팅방 나가기 실패:", error);
    }
  };

  return {
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
  };
};

export default useChatRoom;

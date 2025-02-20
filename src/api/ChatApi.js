import axiosInstance from "./axiosInstance";

export const getMessageHistory = async (roomId) => {
  return await axiosInstance.get(`/chat/history/${roomId}`);
};

export const createChattingRoom = async (chatRoomData) => {
  return await axiosInstance.post(`/chat`, {
    id: chatRoomData.id,
    member: chatRoomData.member,
    shopId: chatRoomData.shopId,
    shopImage: chatRoomData.shopImage,
    shopName: chatRoomData.shopName,
    createdAt: new Date().toISOString(), // 현재 시간을 ISO 문자열로 변환
  });
};

export const getChatRooms = async () => {
  console.log("API 호출 시 헤더:", axiosInstance.defaults.headers);
  return await axiosInstance.get(`/chat/history`);
};

export const getUnReadMessages = async () => {
  return await axiosInstance.get(`/chat/notifications`);
};

export const changeIsRead = async (roomId) => {
  return await axiosInstance.patch(`/chat/${roomId}`);
};

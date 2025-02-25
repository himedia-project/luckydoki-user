import axiosInstance from "./axiosInstance";

export const getMessageHistory = async (roomId) => {
  return await axiosInstance.get(`/chat/history/${roomId}`);
};

export const createChattingRoom = async (chatRoomData) => {
  return await axiosInstance.post(`/chat`, {
    id: chatRoomData.id,
    sender: chatRoomData.member,
    shopId: chatRoomData.shopId,
    shopImage: chatRoomData.shopImage,
    shopName: chatRoomData.shopName,
    lastMessage: new Date().toISOString(),
    createdAt: new Date().toISOString(), // 현재 시간을 ISO 문자열로 변환
  });
};

export const getChatRooms = async () => {
  console.log("API 호출 시 헤더:", axiosInstance.defaults.headers);
  return await axiosInstance.get(`/chat/history`);
};
//대화방 삭제하기
export const deleteChatRooms = async (roomId) => {
  return await axiosInstance.delete(`/${roomId}`);
};
//안읽은 메세지 불러오기
export const getUnReadMessages = async () => {
  return await axiosInstance.get(`/chat/notifications`);
};
//읽은 값 박꾸끼
export const changeIsRead = async (roomId) => {
  return await axiosInstance.patch(`/chat/${roomId}`);
};

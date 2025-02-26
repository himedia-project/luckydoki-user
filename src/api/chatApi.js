import axiosInstance from "./axiosInstance";

// http://localhost:8080/api/chat/history/4
// 해당 채팅방 상세 내역
export const getMessageHistory = async (roomId) => {
  return await axiosInstance.get(`/chat/history/${roomId}`);
};

// http://localhost:8080/api/chat
// 채팅방 생성
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

// http://localhost:8080/api/chat/history
// 채팅방 목록 조회
export const getChatRooms = async () => {
  console.log("API 호출 시 헤더:", axiosInstance.defaults.headers);
  return await axiosInstance.get(`/chat/history`);
};

//대화방 삭제하기 -> 나가기
// http://localhost:8080/api/chat/4
export const deleteChatRooms = async (roomId) => {
  return await axiosInstance.delete(`/chat/${roomId}`);
};

// http://localhost:8080/api/chat/notifications
//안읽은 메세지 불러오기
export const getUnReadMessages = async () => {
  return await axiosInstance.get(`/chat/notifications`);
};

// http://localhost:8080/api/chat/4
//읽은 값 박꾸끼
export const changeIsRead = async (roomId) => {
  return await axiosInstance.patch(`/chat/${roomId}`);
};

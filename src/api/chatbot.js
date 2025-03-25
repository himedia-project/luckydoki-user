import axios from "axios";

const host = process.env.REACT_APP_AI_API_URL;

// 채팅방 생성 API
export const createChatRoom = async (userEmail) => {
  const response = await axios.post(
    `${host}/api/chatbot/room/start${
      userEmail ? `?userEmail=${userEmail}` : ""
    }`
  );
  return response.data; // sessionId 반환
};

// 채팅방 종료 API
export const closeChatRoom = async (sessionId, userEmail) => {
  const response = await axios.post(`${host}/api/chatbot/room/close`, null, {
    params: {
      sessionId,
      userEmail: userEmail || "",
    },
  });
  return response.data; // chatRoomId 반환
};

// http://localhost:8081/api/chatbot/ask?question=이 쇼핑몰의 추천 상품은?
export const getChatbotResponse = async (question, userEmail) => {
  const encodedQuestion = encodeURIComponent(question);
  const response = await axios.get(
    `${host}/api/chatbot/ask?question=${encodedQuestion}&userEmail=${
      userEmail || ""
    }`
  );
  return response;
};

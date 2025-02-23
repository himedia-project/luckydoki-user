import axios from "axios";

const host = process.env.REACT_APP_AI_API_URL;

// http://localhost:8081/api/chatbot/ask?question=이 쇼핑몰의 추천 상품은?
export const getChatbotResponse = async (question) => {
  const encodedQuestion = encodeURIComponent(question);
  const response = await axios.get(
    `${host}/api/chatbot/ask?question=${encodedQuestion}`
  );
  return response;
};

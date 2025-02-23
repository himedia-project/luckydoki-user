import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ImageLoader from "../card/ImageLoader";
import { getChatbotResponse } from "../../api/chatbot";

const ChatWindow = styled.div`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background-color: #6667ab;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 16px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 15px;
  margin: ${(props) => (props.isUser ? "0 0 0 auto" : "0")};
  background-color: ${(props) => (props.isUser ? "#6667AB" : "#f0f0f0")};
  color: ${(props) => (props.isUser ? "white" : "black")};
`;

const InputArea = styled.div`
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;

  &:focus {
    border-color: #6667ab;
  }
`;

const SendButton = styled.button`
  background-color: #6667ab;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0 20px;
  cursor: pointer;

  &:hover {
    background-color: #5556a0;
  }
`;

const ProductLink = styled.div`
  cursor: pointer;
  margin: 10px 0;

  img {
    width: 100%;
    border-radius: 10px;
    margin-bottom: 5px;
  }
`;

const ChatbotWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      text: "안녕하세요! 럭키도키 쇼핑몰 AI 상담사입니다. 무엇을 도와드릴까요?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 사용자 메시지 추가
    setMessages((prev) => [...prev, { text: input, isUser: true }]);

    try {
      // AI 응답 요청
      const response = await getChatbotResponse(input);
      const aiResponse = response.data;

      // AI 응답 처리 및 링크/이미지 변환
      const processedResponse = processAIResponse(aiResponse);
      setMessages((prev) => [
        ...prev,
        { text: processedResponse, isUser: false },
      ]);
    } catch (error) {
      console.error("챗봇 응답 에러:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "죄송합니다. 일시적인 오류가 발생했습니다.",
          isUser: false,
        },
      ]);
    }

    setInput("");
  };

  const processAIResponse = (response) => {
    // 이미지와 링크 매칭을 위한 정규식
    const imageRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;
    const linkRegex = /👉 \[([^\]]*)\]\(([^)]*)\)/g;

    // HTML로 변환
    let processedResponse = response
      .replace(
        imageRegex,
        (match, alt, url) =>
          `<div class="product-image" data-url="${url}">${alt}</div>`
      )
      .replace(
        linkRegex,
        (match, text, url) =>
          `<div class="product-link" data-url="${url}">${text}</div>`
      );

    return processedResponse;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const renderMessage = (message) => {
    if (message.isUser) {
      return <Message isUser={true}>{message.text}</Message>;
    }

    // AI 메시지에서 이미지와 링크 처리
    const messageContainer = document.createElement("div");
    messageContainer.innerHTML = message.text;

    const images = messageContainer.getElementsByClassName("product-image");
    const links = messageContainer.getElementsByClassName("product-link");

    return (
      <Message isUser={false}>
        {Array.from(images).map((img, index) => (
          <ProductLink
            key={`img-${index}`}
            onClick={() => navigate(links[index].dataset.url)}
          >
            <ImageLoader imagePath={img.dataset.url} alt={img.textContent} />
            <div>{links[index].textContent}</div>
          </ProductLink>
        ))}
        {messageContainer.textContent}
      </Message>
    );
  };

  return (
    <ChatWindow>
      <ChatHeader>
        <h3>럭키도키 AI 상담사</h3>
        <CloseButton onClick={onClose}>
          <IoClose />
        </CloseButton>
      </ChatHeader>
      <ChatMessages>
        {messages.map((message, index) => (
          <div key={index}>{renderMessage(message)}</div>
        ))}
        <div ref={messagesEndRef} />
      </ChatMessages>
      <InputArea>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
        />
        <SendButton onClick={handleSend}>전송</SendButton>
      </InputArea>
    </ChatWindow>
  );
};

export default ChatbotWindow;

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
  padding: 10px;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f3f5;
    transform: translateY(-2px);
  }

  .link-text {
    color: #6667ab;
    font-weight: 500;
    text-align: center;
    padding: 5px 0;
  }
`;

const ChatbotWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      text: "안녕하세요! Lukydoki 쇼핑몰 AI 상담사입니다. 무엇을 도와드릴까요?",
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

      // 응답 데이터가 있는지 확인
      if (response && response.data) {
        // AI 응답 처리 및 링크/이미지 변환
        const processedResponse = processAIResponse(response.data);
        setMessages((prev) => [
          ...prev,
          { text: processedResponse, isUser: false },
        ]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("챗봇 응답 에러:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
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

    // 이미지 경로 처리
    let processedText = response.replace(imageRegex, (match, alt, url) => {
      // 전체 URL에서 파일명만 추출
      const imageName = url
        .split("/")
        .pop()
        .replace(/^.*?s_/, "s_");
      return `<div class="product-image" data-image="${imageName}" data-alt="${alt}"></div>`;
    });

    // 링크 처리
    processedText = processedText.replace(linkRegex, (match, text, url) => {
      return `<div class="product-link" data-url="${url}" data-text="${text}"></div>`;
    });

    return processedText;
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

    // 이미지와 링크 요소 추출
    const images = messageContainer.getElementsByClassName("product-image");
    const links = messageContainer.getElementsByClassName("product-link");

    // 일반 텍스트 추출 (이미지와 링크 태그 제외)
    const textContent = message.text
      .replace(/<div class="product-image".*?<\/div>/g, "")
      .replace(/<div class="product-link".*?<\/div>/g, "")
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .replace(/👉 \[.*?\]\(.*?\)/g, "");

    return (
      <Message isUser={false}>
        {/* 일반 텍스트 먼저 렌더링 */}
        <div style={{ marginBottom: "10px" }}>{textContent}</div>

        {/* 이미지와 링크 쌍으로 렌더링 */}
        {Array.from(images).map((img, index) => {
          const link = links[index];
          if (!link) return null;

          const url = link.dataset.url;
          // 상품 또는 셀러 페이지로 이동하는 링크 처리
          const handleClick = () => {
            if (url.startsWith("/product/")) {
              navigate(`/product/${url.split("/").pop()}`);
            } else if (url.startsWith("/shop/")) {
              navigate(`/shop/${url.split("/").pop()}`);
            }
          };

          return (
            <ProductLink key={`product-${index}`} onClick={handleClick}>
              <ImageLoader
                imagePath={img.dataset.image}
                alt={img.dataset.alt}
              />
              <div className="link-text">{link.dataset.text}</div>
            </ProductLink>
          );
        })}
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

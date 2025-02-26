import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ImageLoader from "../card/ImageLoader";
import { getChatbotResponse } from "../../api/chatbot";
import { deleteChatRooms } from "../../api/chatbot";

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
  background-color: #00de90;
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
  padding: 8px;
  transition: all 0.2s ease;
  border-radius: 50%;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: rotate(90deg);
  }
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
  background-color: ${(props) => (props.isUser ? "#00DE90" : "#f0f0f0")};
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
    border-color: #00de90;
  }
`;

const SendButton = styled.button`
  background-color: #00de90;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0 20px;
  cursor: pointer;

  &:hover {
    background-color: #00c580;
  }
`;

const ProductLink = styled.div`
  cursor: pointer;
  margin: 10px 0;
  padding: 10px;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.2s ease;
  width: 200px;

  &:hover {
    background: #f1f3f5;
    transform: translateY(-2px);
  }

  .link-text {
    color: #00de90;
    font-weight: 500;
    text-align: center;
    padding: 5px 0;
    font-size: 13px;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 150px;
  overflow: hidden;
  border-radius: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StyledText = styled.div`
  line-height: 1.6;
  white-space: pre-line;

  h3 {
    color: #00de90;
    margin: 15px 0 10px 0;
    font-size: 16px;
  }

  strong {
    color: #333;
    font-weight: 600;
  }

  ul {
    margin: 10px 0;
    padding-left: 20px;
  }

  li {
    margin: 5px 0;
  }

  .product-title {
    font-size: 15px;
    font-weight: 600;
    color: #00de90;
    margin: 10px 0;
  }

  .product-info {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin: 20px 0;

    p {
      margin: 8px 0;
    }

    p:has(+ p:first-of-type:before) {
      margin-bottom: 16px;
    }

    p:before {
      content: "";
      margin-right: 8px;
    }
  }

  p + .product-info {
    margin-top: 20px;
  }

  .badge + strong,
  strong + .badge {
    margin-left: 8px;
  }

  .highlight {
    color: #ff6b6b;
    font-weight: 600;
  }

  .badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    margin: 0 5px;

    &.best {
      background: #ffd43b;
      color: #e67700;
    }

    &.new {
      background: #d3f9d8;
      color: #2b8a3e;
    }

    &.event {
      background: #fff5f5;
      color: #e03131;
    }
  }
`;

// 기존 LoadingDots 대신 새로운 로딩 인디케이터
const LoadingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 2px;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #00de90;
    opacity: 0.3;
    animation: pulse 1s infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }
`;

const LoadingMessage = styled(Message)`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #666;
  background-color: #f8f9fa;
  max-width: 200px;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ChatbotWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      text: "안녕하세요! Lukydoki 쇼핑몰 AI 상담사입니다. 무엇을 도와드릴까요?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // 사용자 메시지 추가
    setMessages((prev) => [...prev, { text: input, isUser: true }]);
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const processAIResponse = (response) => {
    // 이미지와 링크 매칭을 위한 정규식
    const imageRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;
    const linkRegex = /👉 \[([^\]]*)\]\(([^)]*)\)/g;

    // 이미지 관련 텍스트 제거를 위한 정규식 수정
    const imageTextRegex = /(?:상품|셀러) 이미지:?\s*\n*/g; // 수정된 부분
    const imageAndLinkTextRegex =
      /\*\*(?:상품|셀러) 이미지 및 링크:\*\*\s*\n*/g;

    // 이미지 관련 텍스트 제거
    let cleanedText = response
      // "상품 이미지:" 또는 "셀러 이미지:" 텍스트 제거
      .replace(imageTextRegex, "")
      // "상품 이미지 및 링크:" 또는 "셀러 이미지 및 링크:" 텍스트 제거
      .replace(imageAndLinkTextRegex, "")
      // 이미지와 링크 텍스트 사이의 빈 줄 제거
      .replace(/\n\n+/g, "\n\n")
      // 줄 시작 부분의 불필요한 공백 제거
      .replace(/^\s+/gm, "");

    // 이미지 경로 처리
    let processedText = cleanedText.replace(imageRegex, (match, alt, url) => {
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

    // 텍스트 포맷팅
    let formattedText = processedText
      // 제목 포맷팅
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // 뱃지 포맷팅
      .replace(/🏆BEST🏆/g, '<span class="badge best">BEST</span>')
      .replace(/✨NEW✨/g, '<span class="badge new">NEW</span>')
      .replace(/🎉EVENT🎉/g, '<span class="badge event">EVENT</span>')
      // 상품 정보 섹션 포맷팅
      .replace(/\*\*상품 정보:\*\*([\s\S]*?)(?=\*\*|$)/g, (match, content) => {
        // • 로 시작하는 줄 앞에 추가 여백
        const formattedContent = content
          .replace(/^•/gm, '<span class="bullet">•</span>')
          .trim();
        return `<div class="product-info">${formattedContent}</div>`;
      })
      // 줄바꿈 처리
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br/>")
      // 연속된 빈 줄 제거
      .replace(/<br\/>\s*<br\/>/g, "<br/>");

    return formattedText;
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

    const messageContainer = document.createElement("div");
    messageContainer.innerHTML = message.text;

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
        {/* 텍스트 렌더링 */}
        <StyledText dangerouslySetInnerHTML={{ __html: textContent }} />

        {/* 이미지와 링크 렌더링 */}
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
              <ImageContainer>
                <ImageLoader
                  imagePath={img.dataset.image}
                  alt={img.dataset.alt}
                />
              </ImageContainer>
              <div className="link-text">{link.dataset.text}</div>
            </ProductLink>
          );
        })}
      </Message>
    );
  };

  const handleClose = async () => {
    try {
      if (roomId) {
        // 채팅방 나가기 API 호출
        await deleteChatRooms(roomId);
        console.log("채팅방 나가기 성공");
      }
      // 채팅방 창 닫기
      onClose();
    } catch (error) {
      console.error("채팅방 나가기 실패:", error);
      // 에러가 발생해도 창은 닫기
      onClose();
    }
  };

  return (
    <ChatWindow>
      <ChatHeader>
        <h3>Luckydoki AI 챗봇</h3>
        <CloseButton onClick={handleClose}>
          <IoClose />
        </CloseButton>
      </ChatHeader>
      <ChatMessages>
        {messages.map((message, index) => (
          <div key={index}>{renderMessage(message)}</div>
        ))}
        {isLoading && (
          <LoadingMessage>
            <span>AI 응답 생성중</span>
            <LoadingIndicator>
              <span />
              <span />
              <span />
            </LoadingIndicator>
          </LoadingMessage>
        )}
        <div ref={messagesEndRef} />
      </ChatMessages>
      <InputArea>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          disabled={isLoading}
        />
        <SendButton
          onClick={handleSend}
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.6 : 1 }}
        >
          전송
        </SendButton>
      </InputArea>
    </ChatWindow>
  );
};

export default ChatbotWindow;

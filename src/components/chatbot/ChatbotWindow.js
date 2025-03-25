import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { IoMdImage } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import ImageLoader from "../card/ImageLoader";
import {
  getChatbotResponse,
  createChatRoom,
  closeChatRoom,
} from "../../api/chatbot";
import { analyzeImage } from "../../api/searchApi";
import styles from "../../styles/ChatbotWindow.module.css";
import { useSelector } from "react-redux";

const ChatbotWindow = ({ onClose }) => {
  const userEmail = useSelector((state) => state.loginSlice.email);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([
    {
      text: "안녕하세요! Lukydoki 쇼핑몰 AI 상담사입니다. 무엇을 도와드릴까요?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [startTime] = useState(new Date());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initChatRoom = async () => {
      try {
        const sessionId = await createChatRoom(userEmail);
        console.log("채팅방 생성됨 sessionId:", sessionId);
        setSessionId(sessionId);
      } catch (error) {
        console.error("채팅방 생성 실패:", error);
      }
    };

    initChatRoom();
  }, [userEmail]);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${ampm} ${formattedHours}:${formattedMinutes}`;
  };

  const formatDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const time = formatTime(date);
    return `${month}월 ${day}일 ${time}에 시작함`;
  };

  const handleClose = async () => {
    console.log("채팅방 종료 시도 sessionId:", sessionId);
    try {
      if (sessionId) {
        const chatRoomId = await closeChatRoom(sessionId, userEmail);
        console.log("채팅방 종료됨:", chatRoomId);
      }
      onClose();
    } catch (error) {
      console.error("채팅방 종료 실패:", error);
      onClose();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentTime = new Date();
    setMessages((prev) => [
      ...prev,
      {
        text: input,
        isUser: true,
        timestamp: currentTime,
      },
    ]);
    setIsLoading(true);

    try {
      const response = await getChatbotResponse(input, userEmail);
      if (response && response.data) {
        const processedResponse = processAIResponse(response.data);
        setMessages((prev) => [
          ...prev,
          {
            text: processedResponse,
            isUser: false,
            timestamp: new Date(),
          },
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
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const handleImageUpload = async (event) => {
    if (!sessionId) return;
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    setIsUploading(true);

    try {
      // 이미지 파일 미리보기 URL 생성
      const imageUrl = URL.createObjectURL(file);

      const currentTime = new Date();
      setMessages((prev) => [
        ...prev,
        {
          text: "이미지를 분석 중입니다...",
          isUser: true,
          isImage: true,
          imageUrl: imageUrl,
          timestamp: currentTime,
        },
      ]);

      const response = await analyzeImage(file);

      if (response && response.data) {
        const analysisResult = response.data;
        console.log("분석 결과:", analysisResult);
        setIsLoading(true);

        const mainKeyword = analysisResult[0];

        const chatResponse = await getChatbotResponse(
          `이미지 분석 결과: ${mainKeyword}`,
          userEmail
        );

        if (chatResponse && chatResponse.data) {
          const processedResponse = processAIResponse(chatResponse.data);
          setMessages((prev) => [
            ...prev,
            {
              text: processedResponse,
              isUser: false,
              timestamp: new Date(),
            },
          ]);
        }
      }
    } catch (error) {
      console.error("이미지 분석 에러:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "이미지 분석 중 오류가 발생했습니다. 다시 시도해주세요.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsUploading(false);
      setIsLoading(false);
      setUploadedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current.click();
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
    const messageTime = formatTime(message.timestamp);

    if (message.isUser) {
      return (
        <div className={styles.messageContainer}>
          <div className={`${styles.message} ${styles.userMessage}`}>
            {message.isImage ? (
              <>
                <div>📷 {message.text}</div>
                {message.imageUrl && (
                  <div className={styles.userImagePreview}>
                    <img src={message.imageUrl} alt="업로드한 이미지" />
                  </div>
                )}
              </>
            ) : (
              message.text
            )}
          </div>
          <div className={styles.messageTime}>{messageTime}</div>
        </div>
      );
    }

    // 챗봇 메시지 처리
    const messageContainer = document.createElement("div");
    messageContainer.innerHTML = message.text;

    const images = messageContainer.getElementsByClassName("product-image");
    const links = messageContainer.getElementsByClassName("product-link");

    const textContent = message.text
      .replace(/<div class="product-image".*?<\/div>/g, "")
      .replace(/<div class="product-link".*?<\/div>/g, "")
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .replace(/👉 \[.*?\]\(.*?\)/g, "");

    return (
      <div className={styles.messageContainer}>
        <div className={`${styles.message} ${styles.botMessage}`}>
          <div
            className={styles.styledText}
            dangerouslySetInnerHTML={{ __html: textContent }}
          />
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
              <div
                key={`product-${index}`}
                className={styles.productLink}
                onClick={handleClick}
              >
                <div className={styles.imageContainer}>
                  <ImageLoader
                    imagePath={img.dataset.image}
                    alt={img.dataset.alt}
                  />
                </div>
                <div className={styles.linkText}>{link.dataset.text}</div>
              </div>
            );
          })}
        </div>
        <div className={styles.messageTime}>{messageTime}</div>
      </div>
    );
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <div className={styles.headerContent}>
          <h3>Luckydoki AI 챗봇</h3>
          <span className={styles.startTime}>{formatDate(startTime)}</span>
        </div>
        <button className={styles.closeButton} onClick={handleClose}>
          <IoClose />
        </button>
      </div>
      <div className={styles.chatMessages}>
        {messages.map((message, index) => (
          <div key={index}>{renderMessage(message)}</div>
        ))}
        {isLoading && (
          <div className={styles.loadingMessage}>
            <span>AI 응답 생성중</span>
            <div className={styles.loadingIndicator}>
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputArea}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          disabled={isLoading || isUploading}
        />
        <input
          className={styles.hiddenFileInput}
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageUpload}
        />
        <button
          className={styles.imageUploadButton}
          onClick={handleImageButtonClick}
          disabled={isLoading || isUploading}
          title="이미지 업로드"
        >
          <IoMdImage size={20} />
        </button>
        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={isLoading || isUploading}
          style={{ opacity: isLoading || isUploading ? 0.6 : 1 }}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatbotWindow;

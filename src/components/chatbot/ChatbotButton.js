import React from "react";
import styled from "styled-components";
import { FaRobot } from "react-icons/fa";

const FloatingButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #00b574; // 메인 컬러보다 진한 색상
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background-color 0.2s;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
    background-color: #009a62; // 호버 시 더 진한 색상
  }

  svg {
    color: white;
    font-size: 24px;
  }
`;

const ChatbotButton = ({ onClick }) => {
  return (
    <FloatingButton onClick={onClick}>
      <FaRobot />
    </FloatingButton>
  );
};

export default ChatbotButton;

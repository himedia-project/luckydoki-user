import React, { useState } from "react";
import ChatbotButton from "./ChatbotButton";
import ChatbotWindow from "./ChatbotWindow";

const ChatbotContainer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatbotButton onClick={() => setIsOpen(!isOpen)} />
      {isOpen && <ChatbotWindow onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatbotContainer;

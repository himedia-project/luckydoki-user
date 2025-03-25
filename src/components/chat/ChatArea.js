import React from "react";
import styles from "../../styles/MessagePage.module.css";
import { formatTimeOnly } from "../../utils/dateUtils";
import ImageLoader from "../card/ImageLoader";

export const ChatArea = ({
  selectedRoom,
  routeShopData,
  roomId,
  realTimeMessages,
  userEmail,
  messagesEndRef,
  message,
  setMessage,
  connected,
  onNavigateToShop,
  onLeaveRoom,
  onSendMessage,
}) => {
  return (
    <div className={styles.chatArea}>
      {selectedRoom || (routeShopData && roomId) ? (
        <>
          <ChatHeader
            selectedRoom={selectedRoom}
            onNavigateToShop={onNavigateToShop}
            onLeaveRoom={onLeaveRoom}
          />
          <MessageList
            messages={realTimeMessages}
            userEmail={userEmail}
            messagesEndRef={messagesEndRef}
          />
          <MessageForm
            message={message}
            setMessage={setMessage}
            onSubmit={onSendMessage}
            connected={connected}
          />
        </>
      ) : (
        <div className={styles.noChatSelected}>채팅방을 선택해주세요</div>
      )}
    </div>
  );
};

const ChatHeader = ({ selectedRoom, onNavigateToShop, onLeaveRoom }) => {
  return (
    <div className={styles.chatHeader}>
      <div
        className={styles.partnerInfo}
        onClick={onNavigateToShop}
        style={{ cursor: "pointer" }}
      >
        <div className={styles.partnerImage}>
          <ImageLoader
            imagePath={selectedRoom?.shopImage}
            className={styles.partnerImage}
          />
        </div>
        <div className={styles.partnerDetails}>
          <h3>
            {selectedRoom?.shopName}
            <span className={styles.shopIcon} style={{ marginLeft: "5px" }}>
              🏠
            </span>
          </h3>
        </div>
        <button
          className={styles.leaveButton}
          onClick={(e) => {
            e.stopPropagation();
            onLeaveRoom(selectedRoom.id);
          }}
        >
          나가기
        </button>
      </div>
    </div>
  );
};

const MessageList = ({ messages, userEmail, messagesEndRef }) => {
  return (
    <div className={styles.messagesContainer}>
      {messages.map((msg, index) => (
        <div
          key={`${msg.sendTime}-${index}`}
          className={`${styles.messageItem} ${
            msg.email === userEmail
              ? styles.messageItemRight
              : styles.messageItemLeft
          }`}
        >
          <div
            className={`${styles.messageContent} ${
              msg.email === userEmail
                ? styles.messageSent
                : styles.messageReceived
            }`}
          >
            <p>{msg.message}</p>
            <small className={styles.messageTime}>
              {formatTimeOnly(msg.sendTime)}
            </small>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

const MessageForm = ({ message, setMessage, onSubmit, connected }) => {
  return (
    <div className={styles.messageForm}>
      <form onSubmit={onSubmit} className={styles.messageInputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.messageInput}
          placeholder="메시지를 입력하세요..."
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!connected}
        >
          전송
        </button>
      </form>
    </div>
  );
};

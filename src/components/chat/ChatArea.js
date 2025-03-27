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
  // 메시지 그룹화 함수
  const groupMessagesByUser = (messages) => {
    let groups = [];
    let currentGroup = null;

    messages.forEach((msg) => {
      // 새 그룹 시작 (첫 메시지이거나 이전 발신자와 다를 때)
      if (!currentGroup || currentGroup.email !== msg.email) {
        currentGroup = {
          email: msg.email,
          messages: [msg],
        };
        groups.push(currentGroup);
      } else {
        // 같은 발신자의 메시지 그룹에 추가
        currentGroup.messages.push(msg);
      }
    });

    return groups;
  };

  const messageGroups = groupMessagesByUser(messages);

  return (
    <div className={styles.messagesContainer}>
      {messageGroups.map((group, groupIndex) => {
        const isUserMessage = group.email === userEmail;
        const lastMessage = group.messages[group.messages.length - 1];

        return (
          <div
            key={`group-${groupIndex}`}
            className={`${styles.messageGroup} ${
              isUserMessage ? styles.userMessageGroup : styles.botMessageGroup
            }`}
          >
            {group.messages.map((msg, msgIndex) => (
              <div
                key={`${msg.sendTime}-${msgIndex}`}
                className={styles.messageWrapper}
              >
                <div
                  className={`${styles.message} ${
                    isUserMessage ? styles.userMessage : styles.botMessage
                  }`}
                >
                  <p>{msg.message}</p>
                </div>
              </div>
            ))}

            {/* 그룹의 마지막 메시지 아래에만 시간 표시 */}
            <div className={styles.messageTime}>
              {formatTimeOnly(lastMessage.sendTime)}
            </div>
          </div>
        );
      })}
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

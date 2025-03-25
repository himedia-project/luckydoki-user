import React from "react";
import ImageLoader from "../card/ImageLoader";
import { formatTimeOnly } from "../../utils/dateUtils";
import styles from "../../styles/MessagePage.module.css";

const ChatRoomList = ({
  chatRooms,
  selectedRoom,
  unreadMessages,
  onRoomSelect,
}) => {
  return (
    <div className={styles.chatRoomList}>
      {chatRooms && chatRooms.length > 0 ? (
        chatRooms.map((room) =>
          room && room.id ? (
            <div
              key={room.id}
              className={`${styles.chatRoomItem} ${
                selectedRoom?.id === room.id ? styles.selected : ""
              }`}
              onClick={() => onRoomSelect(room)}
            >
              <div className={styles.shopImage}>
                <ImageLoader
                  imagePath={room.shopImage}
                  className={styles.shopImage}
                />
              </div>
              <div className={styles.roomInfo}>
                <h3>{room.sender}</h3>
                <p className={styles.lastMessage}>
                  {room.lastMessage || "메시지가 없습니다"}
                </p>
                <span className={styles.messageTime}>
                  {room.lastMessageTime
                    ? formatTimeOnly(room.lastMessageTime)
                    : ""}
                </span>
                <span className={styles.unreadCount}>
                  {unreadMessages[room.id] > 0
                    ? `(${unreadMessages[room.id]} 새 메시지)`
                    : 0}
                </span>
              </div>
            </div>
          ) : null
        )
      ) : (
        <div className={styles.noChatRooms}>채팅방이 없습니다.</div>
      )}
    </div>
  );
};

export default ChatRoomList;

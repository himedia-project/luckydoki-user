import React from "react";
import styles from "../styles/ChatRoomList.module.css";
// import MessagePage from "./MessagePage";

const ChatRoomList = ({ onRoomSelect, selectedRoom, chatRooms }) => {
  return (
    <div className={styles.chatRoomList}>
      {chatRooms.map((room) => (
        <div
          key={room.id}
          className={`${styles.chatRoomItem} ${
            selectedRoom?.id === room.id ? styles.selected : ""
          }`}
          onClick={() => onRoomSelect(room)}
        >
          <div className={styles.shopImage}>
            <img src={room.shopImage} alt={room.shopName} />
          </div>
          <div className={styles.roomInfo}>
            <h3>{room.shopName}</h3>
            <p className={styles.lastMessage}>{room.lastMessage}</p>
            <span className={styles.messageTime}>
              {new Date(room.lastMessageTime).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ChatRoomList;

import React from "react";
import style from "../../styles/MessageButton.module.css";
import { useNavigate } from "react-router-dom";

export default function MessageButton({ shopId, shopImage, shopName }) {
  const navigate = useNavigate();

  const handleMoveMessage = () => {
    navigate("/message", {
      state: { shopId, shopImage, shopName },
    });
  };

  return (
    <div className={style.messageButton} onClick={handleMoveMessage}>
      <img src="/colorChat.png" alt="" className={style.message_img} />
      <p>상품문의</p>
    </div>
  );
}

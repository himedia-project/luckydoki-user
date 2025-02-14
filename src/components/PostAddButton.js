import React from "react";
import style from "../styles/PostAddButton.module.css";
import { useNavigate } from "react-router-dom";

export default function PostAddButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/community_add");
  };

  return (
    <div className={style.plus_button} onClick={handleClick}>
      +
    </div>
  );
}

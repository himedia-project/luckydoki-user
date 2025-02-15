import React from "react";
import style from "../styles/PostAddButton.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function PostAddButton() {
  const navigate = useNavigate();
  const nickName = useSelector((state) => state.loginSlice.nickName);

  const handleClick = (e) => {
    if (!nickName) {
      e.preventDefault();
      Swal.fire({
        toast: true,
        position: "top",
        title: "로그인이 필요합니다.",
        icon: "warning",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: false,
      });
      return;
    }
    navigate("/community_add");
  };

  return (
    <div className={style.plus_button} onClick={handleClick}>
      +
    </div>
  );
}

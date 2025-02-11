import React, { useState } from "react";
import style from "../../styles/UserInfoPage.module.css";
import axiosInstance from "../../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function UserInfo() {
  const nav = useNavigate();

  const [userInfo, setUserInfo] = useState({
    nickname: "abcde",
    email: "abcde@abcde.com",
    phone: "010-xxxx-xxxx",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.post("/api/user/update", userInfo);
      alert("회원정보가 저장되었습니다!");
      console.log("저장 성공:", response.data);
    } catch (error) {
      console.error("회원정보 저장 실패:", error);
      alert("회원정보 저장 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "정말 탈퇴하시겠습니까?",
      text: "탈퇴 후 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      reverseButtons: true,
      confirmButtonText: "탈퇴",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete("/api/user/delete", {
            data: { email: userInfo.email },
          });
          Swal.fire("탈퇴되었습니다.", "", "success").then(() => {
            nav("/");
          });
        } catch (error) {
          console.error("회원 탈퇴 실패:", error);
          Swal.fire("회원 탈퇴 중 오류가 발생했습니다.", "", "error");
        }
      }
    });
  };

  return (
    <div className={style.container}>
      <h2 className={style.title}>회원정보</h2>

      <div className={style.inputGroup}>
        <label>이름(닉네임)</label>
        <input
          type="text"
          name="nickname"
          value={userInfo.nickname}
          onChange={handleChange}
          className={style.input}
        />
      </div>

      <div className={style.inputGroup}>
        <label>이메일</label>
        <input
          type="email"
          value={userInfo.email}
          readOnly
          className={`${style.input} ${style.disabled}`}
        />
      </div>

      <div className={style.inputGroup}>
        <label>휴대폰번호</label>
        <input
          type="text"
          name="phone"
          value={userInfo.phone}
          onChange={handleChange}
          className={style.input}
        />
      </div>

      <button onClick={handleSave} className={style.saveButton}>
        회원정보 저장
      </button>

      <button onClick={handleDelete} className={style.deleteButton}>
        회원탈퇴
      </button>
    </div>
  );
}

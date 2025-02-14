import React, { useEffect, useState } from "react";
import style from "../../styles/UserInfoPage.module.css";
import axiosInstance from "../../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getMyProfile, updateMyProfile } from "../../api/memberApi";

export default function UserInfo() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    nickname: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    getMyProfile()
      .then((response) => {
        const { nickName, email, phone } = response.data;
        setUserInfo({
          nickname: nickName || "",
          email: email || "",
          phone: phone || "",
        });
      })
      .catch((error) => {
        console.error("내 정보 불러오기 실패:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 회원정보 수정 핸들러
  const handleSave = async () => {
    try {
      const updateData = {
        nickName: userInfo.nickname,
        phone: userInfo.phone,
      };

      const response = await updateMyProfile(updateData);
      alert("회원정보가 수정되었습니다!");
      console.log("수정 성공:", response.data);
      navigate("/mypage");
    } catch (error) {
      console.error("회원정보 수정 실패:", error);
      alert("회원정보 수정 중 오류가 발생했습니다.");
    }
  };

  // 삭제 핸들러
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
            navigate("/");
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

      {/* 닉네임 */}
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

      {/* 이메일 (readOnly) */}
      <div className={style.inputGroup}>
        <label>이메일</label>
        <input
          type="email"
          value={userInfo.email}
          readOnly
          className={`${style.input} ${style.disabled}`}
        />
      </div>

      {/* 휴대폰번호 */}
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

      {/* 회원정보 저장 버튼 */}
      <button onClick={handleSave} className={style.saveButton}>
        회원정보 저장
      </button>

      {/* 회원탈퇴 버튼 */}
      <button onClick={handleDelete} className={style.deleteButton}>
        회원탈퇴
      </button>
    </div>
  );
}

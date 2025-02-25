import React, { useEffect, useState } from "react";
import style from "../../styles/UserInfoPage.module.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getMyProfile, updateMyProfile } from "../../api/memberApi";
import { quitMember } from "../../api/loginApi";
import ImageLoader from "../../components/card/ImageLoader";

export default function UserInfo() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  const [userInfo, setUserInfo] = useState({
    nickname: "",
    email: "",
    phone: "",
    profileImage: null,
  });

  useEffect(() => {
    getMyProfile()
      .then((response) => {
        const { nickName, email, phone, profileImage } = response.data;
        setUserInfo({
          nickname: nickName || "",
          email: email || "",
          phone: phone || "",
          profileImage: profileImage || "",
        });
        setImage(userInfo.profileImage);
      })
      .catch((error) => {
        console.error("내 정보 불러오기 실패:", error);
      });
  }, []);

  const formatPhoneNumber = (value) => {
    const onlyNumbers = value.replace(/\D/g, "");

    if (onlyNumbers.length <= 3) {
      return onlyNumbers;
    } else if (onlyNumbers.length <= 7) {
      return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
    } else {
      return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(
        3,
        7
      )}-${onlyNumbers.slice(7, 11)}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: name === "phone" ? formatPhoneNumber(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const imagePreviewUrl = URL.createObjectURL(selectedFile);
      setImage(imagePreviewUrl);
      setFile(selectedFile);
    }
  };

  const handleSave = async () => {
    try {
      // const updateData = {
      //   nickName: userInfo.nickname,
      //   phone: userInfo.phone,
      // };
      const formData = new FormData();
      formData.append("nickName", userInfo.nickname);
      formData.append("phone", userInfo.phone);
      formData.append("file", file);

      const response = await updateMyProfile(formData);
      Swal.fire({
        title: "회원정보가 수정되었습니다!",
        icon: "success",
        confirmButtonText: "확인",
      }).then(() => {
        navigate("/mypage");
      });
    } catch (error) {
      console.error("회원정보 수정 실패:", error);
      Swal.fire({
        title: "회원정보 수정 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    Swal.fire({
      title: "정말 탈퇴하시겠습니까?",
      text: "탈퇴 후 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00de90",
      cancelButtonColor: "#d33",
      reverseButtons: true,
      confirmButtonText: "탈퇴",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await quitMember();
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

      {/* 프로필 이미지 */}
      <div
        className={style.profile_container}
        onClick={() => document.getElementById("fileInput").click()}
      >
        {image ? (
          <img src={image} alt="프로필" className={style.profile_image} />
        ) : (
          <ImageLoader
            imagePath={userInfo.profileImage}
            alt="프로필"
            className={style.profile_image}
          />
        )}
        <div className={style.overlay}>수정</div>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={style["hidden-input"]}
        />
      </div>

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

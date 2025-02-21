import React, { useState } from "react";
import style from "../../styles/SellerPage.module.css";
import { upgradeToSeller } from "../../api/registerApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SellerAddPage() {
  const navigate = useNavigate();
  const [image, setImage] = useState("https://placehold.co/100");
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const email = useSelector((state) => state.loginSlice.email);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const imagePreviewUrl = URL.createObjectURL(selectedFile);
      setImage(imagePreviewUrl);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      Swal.fire({
        title: "오류",
        text: "샵 소개글을 입력해주세요.",
        icon: "warning",
      });
      return;
    }
    if (!file) {
      Swal.fire({
        title: "오류",
        text: "샵 이미지를 선택해주세요.",
        icon: "warning",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("introduction", content);
      formData.append("profileImage", file);
      await upgradeToSeller(formData);

      Swal.fire({
        title: "신청 완료",
        text: "셀러 신청이 완료되었습니다.",
        icon: "success",
      });
      navigate("/");
    } catch (error) {
      console.error("셀러 신청 실패:", error);
      Swal.fire({
        title: "실패",
        text:
          error.response.data.errMsg ||
          "셀러 신청에 실패하였습니다. 다시 시도해주세요.",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <h2>셀러 신청</h2>
      <div
        className={style.profile_container}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <img src={image} alt="" className={style.profile_image} />
        <div className={style.overlay}>수정</div>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={style["hidden-input"]}
        />
      </div>
      <div>
        <p>샵 소개글(최대100자)</p>
        <textarea
          name="introduction"
          placeholder="내용을 입력하세요."
          className={style.input_area}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={100}
        />
      </div>
      <button className={style.register_button} onClick={handleSubmit}>
        등록하기
      </button>
    </div>
  );
}

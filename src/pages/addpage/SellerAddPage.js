import React, { useState } from "react";
import style from "../../styles/SellerPage.module.css";

export default function SellerAddPage() {
  const [image, setImage] = useState("https://placehold.co/100");

  const [content, setContent] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };
  return (
    <div>
      <h2>셀러 신청</h2>
      <div
        className={style["profile-container"]}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <img src={image} alt="" className={style["profile-image"]} />
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
          name="desc"
          placeholder="내용을 입력하세요."
          className={style.input_area}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <button className={style.register_button}>등록하기</button>
    </div>
  );
}

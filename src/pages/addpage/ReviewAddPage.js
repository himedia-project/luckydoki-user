import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from "../../styles/ReviewAddPage.module.css";
import StarRating from "../../components/StarRating";
import { createReview } from "../../api/registerApi";
import ImageLoader from "../../components/card/ImageLoader";
import Swal from "sweetalert2";

export default function ReviewAddPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { productImage, productName, productId } = location.state || {};

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 20) {
        Swal.fire({
          toast: true,
          position: "top",
          icon: "warning",
          title: "최대 20MB 이하의 이미지만 업로드할 수 있습니다.",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
      setImageFile(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
  };

  const decodeHTMLEntities = (text) => {
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.body.textContent || "";
  };

  const getPlainText = (html) => {
    return decodeHTMLEntities(
      html
        .replace(/<\/p>/gi, "\n")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/?[^>]+(>|$)/g, "")
    );
  };

  const handleSubmit = async () => {
    const plainTextContent = getPlainText(content || "");
    if (!rating || !content.trim()) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "별점과 리뷰 내용을 입력해주세요.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("content", plainTextContent);
    formData.append("productId", productId);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await createReview(formData);
      Swal.fire({
        title: "리뷰가 등록되었습니다!",
        icon: "success",
        confirmButtonText: "확인",
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "리뷰 등록에 실패했습니다.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className={style.review_container}>
      <h2>상품 리뷰 등록</h2>
      <div className={style.product_info}>
        <ImageLoader
          imagePath={productImage || "default-image.png"}
          className={style.product_img}
          alt="상품 이미지"
        />
        <div className={style.info_box}>
          <p>{productName || "상품명 없음"}</p>
          <StarRating setRating={setRating} />
        </div>
      </div>

      <div>
        <p>상세 리뷰</p>
        <textarea
          name="desc"
          placeholder="내용을 입력하세요."
          className={style.input_area}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className={style.upload_container}>
        <label htmlFor="fileUpload" className={style.upload_button}>
          <img src="backup.png" alt="업로드 아이콘" />
          이미지 업로드
        </label>
        <input
          id="fileUpload"
          type="file"
          accept="image/*"
          className={style.file_input}
          onChange={handleFileChange}
        />
        <p>사진은 최대 20MB 이하의 JPG, PNG 파일 1장까지 첨부 가능합니다.</p>
      </div>

      {imageFile && (
        <div className={style.image_preview_container}>
          <div className={style.image_wrapper}>
            <img
              src={URL.createObjectURL(imageFile)}
              alt="업로드된 이미지"
              className={style.preview_img}
            />
            <button onClick={removeImage} className={style.remove_button}>
              ✕
            </button>
          </div>
        </div>
      )}

      <button className={style.register_button} onClick={handleSubmit}>
        등록하기
      </button>
    </div>
  );
}

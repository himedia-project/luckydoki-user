import React, { useState } from "react";
import style from "../../styles/ReviewAddPage.module.css";
import StarRating from "../../components/StarRating";
import axiosInstance from "../../api/axiosInstance";

export default function ReviewAddPage() {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      alert("최대 5개의 이미지만 업로드할 수 있습니다.");
      return;
    }

    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!rating || !content) {
      alert("별점과 리뷰 내용을 입력해주세요.");
      return;
    }

    // 이미지를 Base64로 변환
    const imageBase64 = await Promise.all(
      imageFiles.map((file) => convertToBase64(file))
    );

    const reviewData = {
      rating,
      email: "user@example.com",
      productId: 123,
      content,
      image: imageBase64[0] || "",
    };

    try {
      const response = await axiosInstance.post("/api/review", reviewData);
      console.log("리뷰 등록 성공:", response.data);
      alert("리뷰가 등록되었습니다!");

      // 폼 초기화
      setRating(0);
      setContent("");
      setImages([]);
      setImageFiles([]);
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  // 파일을 Base64로 변환하는 함수
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className={style.review_container}>
      <h2>상품 리뷰 등록</h2>
      <div className={style.product_info}>
        <img src="logo192.png" className={style.product_img} />
        <div className={style.info_box}>
          <p>상품 제목</p>
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
          <img src="backup.png" />
          이미지 업로드
        </label>
        <input
          id="fileUpload"
          type="file"
          accept="image/*"
          multiple
          className={style.file_input}
          onChange={handleFileChange}
        />
        <p>
          사진은 최대 20MB 이하의 JPG, PNG, GIF 파일 5장까지 첨부 가능합니다.
        </p>
      </div>

      <div className={style.image_preview_container}>
        {images.map((imgSrc, index) => (
          <div key={index} className={style.image_wrapper}>
            <img
              src={imgSrc}
              alt={`uploaded-${index}`}
              className={style.preview_img}
            />
            <button
              onClick={() => removeImage(index)}
              className={style.remove_button}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button className={style.register_button} onClick={handleSubmit}>
        등록하기
      </button>
    </div>
  );
}

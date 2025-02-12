import React, { useState } from "react";
import style from "../../styles/CommunityAdd.module.css";
import ProductSelect from "../../components/ProductSelect";
import SelectedProducts from "../../components/SelectedProducts";

const products = [
  {
    id: 1,
    name: "상품 1",
    price: 100000,
    image: "https://placehold.co/100",
  },
  {
    id: 2,
    name: "상품 2",
    price: 120000,
    image: "https://placehold.co/100",
  },
  {
    id: 3,
    name: "상품 3",
    price: 80000,
    image: "https://placehold.co/100",
  },
  {
    id: 4,
    name: "상품 4",
    price: 150000,
    image: "https://placehold.co/100",
  },
  {
    id: 5,
    name: "상품 5",
    price: 90000,
    image: "https://placehold.co/100",
  },
];

export default function CommunityAddPage() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [title, setTitle] = useState("");
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

  const handleSelectProduct = (product) => {
    if (selectedProducts.length > 5) {
      alert("최대 5개의 상품만 선택할 수 있습니다.");
      return;
    }
    setSelectedProducts([...selectedProducts, product]);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(
      selectedProducts.filter((item) => item.id !== productId)
    );
  };

  return (
    <div>
      <div className={style.community_container}>
        <h2>글 등록</h2>

        <div>
          <p>글 제목</p>
          <input
            name="desc"
            placeholder="내용을 입력하세요."
            className={style.input_title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <p>글 내용</p>
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

        <div>
          <ProductSelect
            products={products}
            onSelect={handleSelectProduct}
            selectedProducts={selectedProducts}
          />
          <SelectedProducts
            selectedProducts={selectedProducts}
            onRemove={handleRemoveProduct}
          />
        </div>

        <button className={style.register_button}>등록하기</button>
      </div>
    </div>
  );
}

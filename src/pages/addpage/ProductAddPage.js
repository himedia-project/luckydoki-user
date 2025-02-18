import React, { useEffect, useState } from "react";
import style from "../../styles/ProductAddPage.module.css";
import {
  getMainCategories,
  getSubCategories,
  getChildCategories,
} from "../../api/categoryApi";
import { createProduct } from "../../api/registerApi";
import Swal from "sweetalert2";

export default function ProductAddPage() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mainCategory: "",
    subCategory: "",
    childCategory: "",
    price: "",
    discountPrice: "",
    stock: "",
    tags: [],
    tagInput: "",
    images: [],
    imageFiles: [],
  });

  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);

  useEffect(() => {
    getMainCategories()
      .then((response) => setMainCategories(response.data))
      .catch((error) => console.error("메인 카테고리 가져오기 실패:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "mainCategory") {
      setSubCategories([]);
      setChildCategories([]);
      setFormData((prev) => ({
        ...prev,
        mainCategory: value,
        subCategory: "",
        childCategory: "",
      }));

      getSubCategories(value)
        .then((response) => setSubCategories(response.data))
        .catch((error) => console.error("서브 카테고리 가져오기 실패:", error));
    }

    if (name === "subCategory") {
      setChildCategories([]);
      setFormData((prev) => ({
        ...prev,
        subCategory: value,
        childCategory: "",
      }));

      getChildCategories(value)
        .then((response) => setChildCategories(response.data))
        .catch((error) => console.error("자식 카테고리 가져오기 실패:", error));
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (formData.tagInput.trim() === "") return;
      if (formData.tags.length >= 5) {
        Swal.fire({
          toast: true,
          position: "top",
          icon: "warning",
          title: "최대 5개의 태그만 추가할 수 있습니다.",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: "",
      }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 5) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "최대 5개의 이미지만 업로드할 수 있습니다.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    const newImages = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
      imageFiles: [...prev.imageFiles, ...files],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.content ||
      !formData.price ||
      !formData.stock
    ) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "모든 필수 정보를 입력해주세요.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    if (!formData.childCategory) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "자식 카테고리를 선택해주세요.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const multipartFormData = new FormData();
    multipartFormData.append(
      "categoryId",
      parseInt(formData.childCategory, 10)
    );
    multipartFormData.append("name", formData.title);
    multipartFormData.append("price", parseInt(formData.price, 10));
    multipartFormData.append(
      "discountPrice",
      parseInt(formData.discountPrice, 10) || 0
    );
    multipartFormData.append("description", formData.content);
    multipartFormData.append("stockNumber", parseInt(formData.stock, 10));

    formData.imageFiles.forEach((file) => {
      multipartFormData.append("files", file);
    });

    formData.tags.forEach((tag) => {
      multipartFormData.append("tagStrList", tag);
    });

    try {
      const response = await createProduct(multipartFormData);
      Swal.fire({
        title: "상품 등록이 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      }).then(() => {
        window.history.back();
      });

      // 폼 리셋
      setFormData({
        title: "",
        content: "",
        mainCategory: "",
        subCategory: "",
        childCategory: "",
        price: "",
        discountPrice: "",
        stock: "",
        tags: [],
        tagInput: "",
        images: [],
        imageFiles: [],
      });
    } catch (error) {
      console.error("상품 등록 실패:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "상품 등록에 실패했습니다. 다시 시도해주세요.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className={style.product_container}>
      <h2>상품 등록</h2>

      {/* 상품 이름 */}
      <div>
        <p>상품 이름</p>
        <textarea
          name="title"
          placeholder="상품 이름을 입력하세요."
          className={style.input_title}
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      {/* 카테고리 */}
      <div>
        <p>카테고리</p>
        <div className={style.category_selects}>
          <select
            name="mainCategory"
            className={style.select}
            value={formData.mainCategory}
            onChange={handleCategoryChange}
          >
            <option value="">메인 카테고리</option>
            {mainCategories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            name="subCategory"
            className={style.select}
            value={formData.subCategory}
            onChange={handleCategoryChange}
            disabled={!formData.mainCategory}
          >
            <option value="">서브 카테고리</option>
            {subCategories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            name="childCategory"
            className={style.select}
            value={formData.childCategory}
            onChange={handleCategoryChange}
            disabled={!formData.subCategory}
          >
            <option value="">자식 카테고리</option>
            {childCategories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 가격, 할인, 재고 */}
      <div className={style.price_section}>
        <div className={style.input_box}>
          <p>상품 가격</p>
          <input
            type="number"
            name="price"
            placeholder="가격을 입력해주세요."
            className={style.input}
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div className={style.input_box}>
          <p>할인 가격</p>
          <input
            type="number"
            name="discountPrice"
            placeholder="할인 가격을 입력해주세요."
            className={style.input}
            value={formData.discountPrice}
            onChange={handleChange}
          />
        </div>
        <div className={style.input_box}>
          <p>재고 수량</p>
          <input
            type="number"
            name="stock"
            placeholder="수량을 입력해주세요."
            className={style.input}
            value={formData.stock}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 태그 */}
      <div className={style.tag_section}>
        <p>태그 (최대 5개)</p>
        <input
          type="text"
          name="tagInput"
          placeholder="태그를 입력하고 엔터를 누르세요."
          className={style.input_tag}
          value={formData.tagInput}
          onChange={handleChange}
          onKeyPress={handleTagAdd}
        />
        <div className={style.tag_list}>
          {formData.tags.map((tag, index) => (
            <span key={index} className={style.tag}>
              #{tag}
              <button
                className={style.tag_remove}
                onClick={() => handleTagRemove(tag)}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 상품 설명 */}
      <div>
        <p>상품 설명</p>
        <textarea
          name="content"
          placeholder="내용을 입력하세요."
          className={style.input_area}
          value={formData.content}
          onChange={handleChange}
        />
      </div>

      {/* 이미지 업로드 */}
      <div className={style.upload_container}>
        <label htmlFor="fileUpload" className={style.upload_button}>
          <img src="backup.png" alt="업로드" />
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
        <p>사진은 최대 20MB 이하의 JPG, PNG 파일 5장까지 첨부 가능합니다.</p>
      </div>

      {/* 이미지 미리보기 */}
      <div className={style.image_preview_container}>
        {formData.images.map((imgSrc, index) => (
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

      {/* 등록 버튼 */}
      <button className={style.register_button} onClick={handleSubmit}>
        등록하기
      </button>
    </div>
  );
}

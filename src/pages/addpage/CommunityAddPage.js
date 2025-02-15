import React, { useEffect, useState } from "react";
import style from "../../styles/CommunityAdd.module.css";
import ProductSelect from "../../components/ProductSelect";
import SelectedProducts from "../../components/SelectedProducts";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getShopProducts } from "../../api/shopApi";
import { createPost } from "../../api/communityApi";

export default function CommunityAddPage() {
  const navigate = useNavigate();
  // ✅ roles가 "SELLER"인지 "USER"인지에 따라 상품 태그 UI 표시할지 결정
  const shopId = useSelector((state) => state.infoSlice?.shopId);
  const roles = useSelector((state) => state.loginSlice.roles[0]);

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (!shopId || roles !== "SELLER") return;

    const fetchProducts = async () => {
      try {
        const response = await getShopProducts(shopId);
        setProducts(response.data.productList);
      } catch (error) {
        console.error("상품 목록 가져오기 실패:", error);
      }
    };

    fetchProducts();
  }, [shopId, roles]);

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
    if (selectedProducts.length >= 5) {
      alert("최대 5개의 상품만 선택할 수 있습니다.");
      return;
    }
    const alreadySelected = selectedProducts.find((p) => p.id === product.id);
    if (alreadySelected) {
      alert("이미 선택된 상품입니다.");
      return;
    }
    setSelectedProducts([...selectedProducts, product]);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const handleRegister = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    if (imageFiles.length === 0) {
      alert("이미지 파일은 최소 1장 이상 첨부해야 합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    selectedProducts.forEach((product) => {
      formData.append("productIds", product.id);
    });

    imageFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await createPost(formData);
      alert("게시글이 등록되었습니다!");
      navigate("/community");
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      alert("게시글 등록에 실패했습니다.");
    }
  };

  return (
    <div className={style.community_container}>
      <h2>글 등록</h2>

      {/* 제목 */}
      <div>
        <p>글 제목</p>
        <input
          name="desc"
          placeholder="제목을 입력하세요."
          className={style.input_title}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 내용 */}
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
        <p>
          사진은 최대 20MB 이하의 JPG, PNG, GIF 파일 5장까지 첨부 가능합니다.
        </p>
      </div>

      {/* 이미지 미리보기 */}
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

      {/* SELLER만 상품 선택 UI 표시 */}
      {roles === "SELLER" && (
        <>
          <ProductSelect
            products={products}
            onSelect={handleSelectProduct}
            selectedProducts={selectedProducts}
          />
          <SelectedProducts
            selectedProducts={selectedProducts}
            onRemove={handleRemoveProduct}
          />
        </>
      )}

      {/* 등록 버튼 */}
      <button className={style.register_button} onClick={handleRegister}>
        등록하기
      </button>
    </div>
  );
}

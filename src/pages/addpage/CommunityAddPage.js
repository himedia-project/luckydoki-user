import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { createPost } from "../../api/communityApi";
import { getShopProducts } from "../../api/shopApi";
import ProductSelect from "../../components/ProductSelect";
import SelectedProducts from "../../components/SelectedProducts";
import style from "../../styles/CommunityAdd.module.css";
import TinyMCEEditor from "../../components/Editor";

export default function CommunityAddPage() {
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
    setImages((prev) => [...prev, ...newImages]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleSelectProduct = (product) => {
    if (selectedProducts.length >= 5) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "최대 5개의 상품만 선택할 수 있습니다.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    const alreadySelected = selectedProducts.find((p) => p.id === product.id);
    if (alreadySelected) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "이미 선택된 상품입니다.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    setSelectedProducts([...selectedProducts, product]);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
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

  const handleRegister = async () => {
    const plainTextContent = getPlainText(content);
    if (!title.trim() || !content.trim()) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "제목과 내용을 입력해주세요.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    if (imageFiles.length === 0) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "이미지 파일은 최소 1장 이상 첨부해야 합니다.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", plainTextContent);

    selectedProducts.forEach((product) => {
      formData.append("productIds", product.id);
    });

    imageFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await createPost(formData);
      Swal.fire({
        title: "상품 등록이 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      }).then(() => {
        window.history.back();
      });

      setTitle("");
      setContent("");
      setImages([]);
      setImageFiles([]);
      setSelectedProducts([]);
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "게시글 등록에 실패했습니다. 다시 시도해주세요.",
        showConfirmButton: false,
        timer: 1500,
      });
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
        <TinyMCEEditor content={content} setContent={setContent} />
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

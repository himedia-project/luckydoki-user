import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import style from "../styles/ProductDetail.module.css";
import { getProductInfo } from "../api/productApi";
import ImageLoader from "../components/card/ImageLoader";
import { addCartItem } from "../api/cartApi";
import Swal from "sweetalert2";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductInfo(productId);
        setProduct(response.data);
        setMainImage(response.data.uploadFileNames[0]);
      } catch (error) {
        console.error("상품 정보를 불러오지 못했습니다.", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) return <p>상품 정보를 불러오는 중...</p>;

  // 가격 계산
  const totalPrice = (product.discountPrice * quantity).toLocaleString();
  const isDiscounted = product.discountRate > 0;

  const handleMoveReviewAdd = () => {
    navigate("/review_add");
  };

  const handleAddToCart = async () => {
    try {
      await addCartItem(productId, quantity);

      const result = await Swal.fire({
        title: "장바구니에 추가되었습니다.",
        text: "장바구니로 이동하시겠습니까?",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "확인",
        cancelButtonText: "아니요",
      });

      if (result.isConfirmed) {
        navigate("/cart");
      }
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      Swal.fire({
        title: "오류",
        text: "장바구니 추가에 실패했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  return (
    <div className={style.container}>
      {/* 왼쪽 섹션 */}
      <section className={style.leftSection}>
        <div className={style.imageContainer}>
          {/* 상품 대표 이미지 */}
          <ImageLoader
            imagePath={mainImage}
            alt={product.name}
            className={style.mainImage}
          />
          {/* 썸네일 이미지 리스트 */}
          <div className={style.thumbnailContainer}>
            {product.uploadFileNames.map((img, index) => (
              <ImageLoader
                key={index}
                imagePath={img}
                alt={`상품 이미지 ${index + 1}`}
                className={`${style.thumbnail} ${
                  img === mainImage ? style.activeThumbnail : ""
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        <div className={style.buttonBox}>
          <button className={style.productButton}>상품정보</button>
          <button className={style.productButton}>상품리뷰</button>
        </div>

        {/* 상품 정보 */}
        <div className={style.productDescription}>
          <p>{product.description}</p>
        </div>

        {/* 리뷰 */}
        <div className={style.reviewSection}>
          <div className={style.review_top}>
            <h3>상품 리뷰 (0)</h3>
            <p
              className={style.review_add_button}
              onClick={handleMoveReviewAdd}
            >
              리뷰 작성
            </p>
          </div>
          <p>등록된 리뷰가 없습니다.</p>
        </div>

        {/* 태그 */}
        <div className={style.tagSection}>
          <h3>작품 키워드</h3>
          <div className={style.tagList}>
            {product.tagStrList.map((tag, index) => (
              <span key={index} className={style.tag}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 오른쪽 섹션 */}
      <section className={style.rightSection}>
        <div className={style.shopInfo}>
          <ImageLoader
            imagePath={product.shopImage}
            alt="샵 이미지"
            className={style.shop_img}
          />
          <p>{product.shopName} mart</p>
        </div>

        <div className={style.title_container}>
          <h2 className={style.productName}>{product.name}</h2>
          <img src="/heart.png" alt="" className={style.heart_img} />
        </div>

        {/* 할인 정보 */}
        <div className={style.priceSection}>
          <div className={style.discountBox}>
            {isDiscounted && (
              <span className={style.discountRate}>
                {product.discountRate}%
              </span>
            )}
            {isDiscounted && (
              <p className={style.originalPrice}>
                {product.price.toLocaleString()}원
              </p>
            )}
          </div>
          <p className={style.discountPrice}>
            {product.discountPrice.toLocaleString()}원
          </p>
        </div>

        {/* 수량 선택 */}
        <div className={style.quantitySelector}>
          <p>수량</p>
          <div className={style.quantity_button_container}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>

        {/* 총 결제 금액 */}
        <div className={style.totalPrice}>
          총 결제금액: <strong>{totalPrice}원</strong>
        </div>

        {/* 버튼 */}
        <div className={style.buttonContainer}>
          <button className={style.cartButton} onClick={handleAddToCart}>
            장바구니
          </button>
          <button className={style.buyButton}>구매하기</button>
        </div>
      </section>
    </div>
  );
}

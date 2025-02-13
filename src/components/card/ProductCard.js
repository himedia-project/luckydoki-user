import React, { useEffect, useState } from "react";
import styles from "../../styles/ProductCard.module.css"; // ✅ 스타일 파일 불러오기
import { likeProduct } from "../../api/likesApi";
import Swal from "sweetalert2";
import { getImageUrl } from "../../api/imageApi";
import { useNavigate } from "react-router-dom";

const DEFAULT_IMAGE = "/images/default_product.png";

const ProductCard = ({
  id,
  name,
  price,
  discountPrice,
  discountRate,
  productImageUrl,
  likes,
  isNew,
  event,
  best,
  onUnlike,
}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(likes);
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (productImageUrl) {
      getImageUrl(productImageUrl).then((imageUrl) => setImageSrc(imageUrl));
    }
  }, [productImageUrl]);

  const handleLike = async () => {
    try {
      await likeProduct(id);

      if (isLiked) {
        onUnlike(id);
      } else {
        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "찜목록에 추가되었습니다.",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: false,
        });
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error("찜 추가/삭제 실패:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "찜 추가/삭제 중 오류가 발생했습니다.",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    }
  };

  // 상세 페이지 이동 handler
  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className={styles.productCard} onClick={handleCardClick}>
      {/* ✅ 이미지 컨테이너 */}
      <div className={styles.imageContainer}>
        <img src={imageSrc} alt={name} className={styles.productImage} />
        {/* ✅ 하트(찜) 아이콘 */}
        <button
          className={styles.likeButton}
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
        >
          <img
            src={isLiked ? "/fillHeart.png" : "/backheart.png"}
            alt="찜하기"
          />
        </button>
      </div>

      {/* ✅ 상품 이름 */}
      <p className={styles.productName}>{name}</p>

      {/* ✅ 할인율 & 가격 */}
      <p className={styles.productPrice}>
        {discountRate > 0 && (
          <span className={styles.discountRate}>{discountRate}%</span>
        )}
        {price.toLocaleString()}원
      </p>
      <p className={styles.discountPrice}>{discountPrice.toLocaleString()}원</p>

      {/* ✅ 태그 버튼 (조건부 렌더링) */}
      <div className={styles.tagContainer}>
        {isNew && <span className={styles.tagNew}>new</span>}
        {event && <span className={styles.tagEvent}>event</span>}
        {best && <span className={styles.tagBest}>best</span>}
      </div>
    </div>
  );
};

export default ProductCard;

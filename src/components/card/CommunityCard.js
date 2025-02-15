import React from "react";
import styles from "../../styles/CommunityCard.module.css";
import ImageLoader from "../card/ImageLoader";
import { useNavigate } from "react-router-dom";

const CommunityCard = ({
  id,
  content,
  createdAt,
  nickName,
  uploadFileNames,
  sellerImage,
  productDTOs,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/community/${id}`);
  };

  const handleProductClick = (productId, event) => {
    event.stopPropagation();
    navigate(`/product/${productId}`);
  };

  return (
    <div className={styles.communityCard} onClick={handleCardClick}>
      <div className={styles.header}>
        <ImageLoader imagePath={sellerImage} className={styles.sellerImage} />
        <div className={styles.userInfo_box}>
          <span className={styles.author}>{nickName}</span>
          <span className={styles.date}>{createdAt}</span>
        </div>
      </div>
      {uploadFileNames?.length > 0 && (
        <div className={styles.imageContainer}>
          <ImageLoader imagePath={uploadFileNames[0]} alt="게시글 이미지" />
        </div>
      )}

      {productDTOs?.length > 0 && (
        <div className={styles.tagList}>
          <p className={styles.tag}>태그된 작품 {productDTOs.length}개</p>
          <div className={styles.cardList}>
            {productDTOs.slice(0, 2).map((product) => (
              <div
                key={product.id}
                className={styles.tagInfoBox}
                onClick={(event) => handleProductClick(product.id, event)}
              >
                <div className={styles.productImageContainer}>
                  <ImageLoader
                    imagePath={product.uploadFileNames[0]}
                    alt={product.name}
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.InfoBox}>
                  <p className={styles.title}>{product.name}</p>
                  {product.discountRate > 0 && (
                    <div className={styles.rateBox}>
                      <b className={styles.rate}>{product.discountRate}%</b>
                      <b className={styles.price}>
                        {product.price?.toLocaleString()}
                        <span className={styles.won}>원</span>
                      </b>
                    </div>
                  )}
                  <b className={styles.discountPrice}>
                    {product.price?.toLocaleString()}
                    <span className={styles.won}>원</span>
                  </b>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.cardContent}>
        <p className={styles.content}>{content}</p>
      </div>

      <div className={styles.comment_box}>
        <img src="/chat.png" alt="" className={styles.comment_img} />
        <span className={styles.comment}>댓글쓰기</span>
      </div>
    </div>
  );
};

export default CommunityCard;

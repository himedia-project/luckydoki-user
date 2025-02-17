import React from "react";
import styles from "../../styles/CommunityCard.module.css";
import ImageLoader from "../card/ImageLoader";
import { useNavigate } from "react-router-dom";
import TaggedProducts from "./TaggedProducts";

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
    navigate(`/community/${id}`, {
      state: {
        id,
        content,
        createdAt,
        nickName,
        uploadFileNames,
        sellerImage,
        productDTOs,
      },
    });
  };

  const handleProductClick = (productId, event) => {
    event.stopPropagation();
    navigate(`/product/${productId}`);
  };

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
  };

  return (
    <div className={styles.communityCard} onClick={handleCardClick}>
      <div className={styles.header}>
        <ImageLoader imagePath={sellerImage} className={styles.sellerImage} />
        <div className={styles.userInfo_box}>
          <span className={styles.author}>{nickName}</span>
          <span className={styles.date}>{formatDate(createdAt)}</span>
        </div>
      </div>
      {uploadFileNames?.length > 0 && (
        <div className={styles.imageContainer}>
          <ImageLoader imagePath={uploadFileNames[0]} alt="게시글 이미지" />
        </div>
      )}

      {productDTOs?.length > 0 && (
        <TaggedProducts
          productDTOs={productDTOs}
          handleProductClick={handleProductClick}
          limit={2}
        />
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

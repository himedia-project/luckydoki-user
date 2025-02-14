import React from "react";
import styles from "../../styles/CommunityCard.module.css";
import ImageLoader from "../card/ImageLoader";
import { useNavigate } from "react-router-dom";

const CommunityCard = ({
  id,
  title,
  content,
  createdAt,
  nickName,
  uploadFileNames,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/community/${id}`);
  };

  return (
    <div className={styles.communityCard} onClick={handleCardClick}>
      {uploadFileNames?.length > 0 && (
        <div className={styles.imageContainer}>
          <ImageLoader imagePath={uploadFileNames[0]} alt="게시글 이미지" />
        </div>
      )}

      <div className={styles.cardContent}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.content}>{content}</p>
        <div className={styles.footer}>
          <span className={styles.author}>{nickName}</span>
          <span className={styles.date}>{createdAt}</span>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;

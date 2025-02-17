import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostInfo } from "../../api/communityApi";
import ImageLoader from "../../components/card/ImageLoader";
import TaggedProducts from "../../components/card/TaggedProducts";
import styles from "../../styles/CommunityDetailPage.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postInfo, setPostInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const imgPrevRef = useRef(null);
  const imgNextRef = useRef(null);
  const productPrevRef = useRef(null);
  const productNextRef = useRef(null);

  useEffect(() => {
    const fetchPostInfo = async () => {
      try {
        const response = await getPostInfo(id);
        setPostInfo(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostInfo();
  }, [id]);

  const handleProductClick = (productId, event) => {
    if (event) {
      event.stopPropagation();
    }
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!postInfo) {
    return <div>게시글 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className={styles.detailContainer}>
      <div className={styles.userInfoBox}>
        <ImageLoader
          imagePath={postInfo.shopImage}
          className={styles.shopImage}
        />
        <div className={styles.infoBox}>
          <p className={styles.author}>{postInfo.nickName}</p>
          <p className={styles.date}>{postInfo.createdAt}</p>
        </div>
      </div>

      {/* 📌 게시글 이미지 Swiper (개별 네비게이션) */}
      {postInfo.uploadFileNames && postInfo.uploadFileNames.length > 0 && (
        <div className={styles.swiperContainer}>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            navigation={{
              prevEl: imgPrevRef.current,
              nextEl: imgNextRef.current,
            }}
            pagination={{ clickable: true }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = imgPrevRef.current;
              swiper.params.navigation.nextEl = imgNextRef.current;
            }}
            className={styles.imageSwiper}
          >
            {postInfo.uploadFileNames.map((filePath, index) => (
              <SwiperSlide key={index}>
                <ImageLoader
                  imagePath={filePath}
                  alt={`게시글 이미지 ${index + 1}`}
                  className={styles.postImage}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            ref={imgPrevRef}
            className={`${styles.navButton} ${styles.prevButton}`}
          >
            &lt;
          </button>
          <button
            ref={imgNextRef}
            className={`${styles.navButton} ${styles.nextButton}`}
          >
            &gt;
          </button>
        </div>
      )}

      {postInfo.productDTOs && postInfo.productDTOs.length > 0 && (
        <TaggedProducts
          productDTOs={postInfo.productDTOs}
          handleProductClick={handleProductClick}
          prevRef={productPrevRef}
          nextRef={productNextRef}
        />
      )}

      <div className={styles.content}>{postInfo.content}</div>
    </div>
  );
}

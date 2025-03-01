import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostInfo } from "../../api/communityApi";
import ImageLoader from "../../components/card/ImageLoader";
import TaggedProducts from "../../components/card/TaggedProducts";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "../../styles/CommunityDetailPage.module.css";
import CommunityComments from "../../components/CommunityComments";

export default function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postInfo, setPostInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Swiper 관련 ref 선언
  const imgSwiperRef = useRef(null);
  const imgPrevRef = useRef(null);
  const imgNextRef = useRef(null);

  useEffect(() => {
    const fetchPostInfo = async () => {
      setLoading(true);
      try {
        const response = await getPostInfo(id);
        setPostInfo(response.data);
        setError(null);
      } catch (err) {
        console.error("게시글 정보를 불러오는데 실패했습니다:", err);
        setError("게시글을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    // 분석 스크립트 로딩과 관계없이 데이터 먼저 가져오기
    fetchPostInfo();
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (imgSwiperRef.current?.swiper) {
        const swiper = imgSwiperRef.current.swiper;
        swiper.params.navigation.prevEl = imgPrevRef.current;
        swiper.params.navigation.nextEl = imgNextRef.current;
        swiper.navigation.destroy();
        swiper.navigation.init();
        swiper.navigation.update();
      }
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleProductClick = (productId, event) => {
    if (event) {
      event.stopPropagation();
    }
    navigate(`/product/${productId}`);
  };

  const handleShopClick = (event, shopId) => {
    event.stopPropagation();

    if (shopId === null || shopId === undefined) {
      return;
    }

    navigate(`/shop/${shopId}`);
  };

  // 태그 클릭 핸들러 추가
  const handleTagClick = (tagName) => {
    navigate(`/search?searchKeyword=${encodeURIComponent(tagName)}`);
  };

  return (
    <div className={styles.detailContainer}>
      {loading ? (
        <div className={styles.loadingContainer}>
          <p>게시글을 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button onClick={() => navigate("/community")}>
            커뮤니티로 돌아가기
          </button>
        </div>
      ) : (
        <>
          <div className={styles.userInfoBox}>
            <ImageLoader
              imagePath={postInfo?.authorImage}
              className={styles.shopImage}
              onClick={(event) => handleShopClick(event, postInfo?.shopId)}
            />
            <div
              className={styles.infoBox}
              onClick={(event) => handleShopClick(event, postInfo?.shopId)}
            >
              <p className={styles.author}>{postInfo?.nickName}</p>
              <p className={styles.date}>
                {new Date(postInfo?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* 이미지 스와이퍼 영역 */}
          {postInfo?.uploadFileNames &&
            postInfo?.uploadFileNames.length > 0 && (
              <div className={styles.imageSwiperWrapper}>
                <Swiper
                  ref={imgSwiperRef}
                  spaceBetween={10}
                  slidesPerView={1}
                  loop={postInfo?.uploadFileNames.length > 1}
                  navigation={{
                    prevEl: imgPrevRef.current,
                    nextEl: imgNextRef.current,
                  }}
                  pagination={{ clickable: true, el: ".custom-pagination" }}
                  modules={[Navigation, Pagination]}
                  className={styles.imageSwiper}
                >
                  {postInfo?.uploadFileNames.map((filePath, index) => (
                    <SwiperSlide key={index} className={styles.slide}>
                      <ImageLoader
                        imagePath={filePath}
                        alt={`게시글 이미지 ${index + 1}`}
                        className={styles.postImage}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div className="custom-pagination" />

                {postInfo?.uploadFileNames.length > 1 && (
                  <>
                    <button
                      ref={imgPrevRef}
                      className={`${styles.navButton} ${styles.prevButton}`}
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                    <button
                      ref={imgNextRef}
                      className={`${styles.navButton} ${styles.nextButton}`}
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            )}
          <div className={styles.content}>{postInfo?.content}</div>

          <div className={styles.tagSection}>
            <div className={styles.tagList}>
              {postInfo?.tagList?.map((tag) => (
                <span
                  key={tag?.id}
                  className={styles.tag}
                  onClick={() => handleTagClick(tag?.name)}
                  style={{ cursor: "pointer" }}
                >
                  #{tag?.name}
                </span>
              ))}
            </div>
          </div>

          {/* 댓글 */}
          <CommunityComments postId={id} />
        </>
      )}
    </div>
  );
}

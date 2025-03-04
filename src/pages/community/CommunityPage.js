import React, { useEffect, useState, useRef, useCallback } from "react";
import { searchCommunity } from "../../api/searchApi";
import PostAddButton from "../../components/button/PostAddButton";
import CommunityCard from "../../components/card/CommunityCard";
import style from "../../styles/CommunityPage.module.css";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // 마지막 요소 참조 콜백 함수
  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMorePosts();
          }
        },
        { threshold: 0.5 }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // 초기 데이터 로드
  useEffect(() => {
    const fetchCommunityPosts = async () => {
      try {
        setLoading(true);
        const response = await searchCommunity(null, 1, 10);
        setPosts(response.data.dtoList || []);
        setHasMore(response.data.current < response.data.totalPage);
        setLoading(false);
      } catch (error) {
        console.error("커뮤니티 글 조회 실패:", error);
        setLoading(false);
      }
    };

    fetchCommunityPosts();
  }, []);

  // 추가 데이터 로드
  const loadMorePosts = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const response = await searchCommunity(null, nextPage, 10);

      if (response.data.dtoList && response.data.dtoList.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...response.data.dtoList]);
        setPage(nextPage);
        setHasMore(response.data.current < response.data.totalPage);
      } else {
        setHasMore(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("추가 커뮤니티 글 조회 실패:", error);
      setLoading(false);
    }
  };

  return (
    <div className={style.community_container}>
      <h2>커뮤니티</h2>

      {posts.length > 0 ? (
        <div className={style.community_grid_wrapper}>
          <div className={style.community_grid_left}>
            {posts
              .filter((_, index) => index % 2 === 0)
              .map((post, index, filteredArray) => (
                <div
                  key={post?.id}
                  ref={
                    index === filteredArray.length - 1
                      ? lastPostElementRef
                      : null
                  }
                >
                  <CommunityCard
                    id={post?.id}
                    title={post?.title}
                    content={post?.content}
                    createdAt={post?.createdAt}
                    nickName={post?.nickName}
                    uploadFileNames={post?.uploadFileNames}
                    productDTOs={post?.productDTOs}
                    sellerImage={post?.authorImage}
                    shopId={post?.shopId}
                  />
                </div>
              ))}
          </div>
          <div className={style.community_grid_right}>
            {posts
              .filter((_, index) => index % 2 === 1)
              .map((post) => (
                <CommunityCard
                  key={post?.id}
                  id={post?.id}
                  title={post?.title}
                  content={post?.content}
                  createdAt={post?.createdAt}
                  nickName={post?.nickName}
                  uploadFileNames={post?.uploadFileNames}
                  productDTOs={post?.productDTOs}
                  sellerImage={post?.authorImage}
                  hideSwiper={true}
                  shopId={post?.shopId}
                />
              ))}
          </div>
        </div>
      ) : (
        <p className={style.no_community}>등록된 커뮤니티 글이 없습니다.</p>
      )}

      {loading && <p className={style.loading}>로딩 중...</p>}

      <PostAddButton />
    </div>
  );
}

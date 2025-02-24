import React, { useEffect, useState } from "react";
import { searchCommunity } from "../../api/searchApi";
import PostAddButton from "../../components//button/PostAddButton";
import CommunityCard from "../../components/card/CommunityCard";
import style from "../../styles/CommunityPage.module.css";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchCommunityPosts = async () => {
      try {
        const response = await searchCommunity();
        setPosts(response.data || []);
      } catch (error) {
        console.error("커뮤니티 글 조회 실패:", error);
      }
    };

    fetchCommunityPosts();
  }, []);

  return (
    <div className={style.community_container}>
      <h2>커뮤니티</h2>
      {posts.length > 0 ? (
        <div className={style.community_grid_wrapper}>
          <div className={style.community_grid_left}>
            {posts.slice(0, Math.ceil(posts.length / 2)).map((post) => (
              <CommunityCard
                key={post?.id}
                id={post?.id}
                title={post?.title}
                content={post?.content}
                createdAt={post?.createdAt}
                nickName={post?.nickName}
                uploadFileNames={post?.uploadFileNames}
                productDTOs={post?.productDTOs}
                sellerImage={post?.shopImage}
                shopId={post?.shopId}
              />
            ))}
          </div>
          <div className={style.community_grid_right}>
            {posts.slice(Math.ceil(posts.length / 2)).map((post) => (
              <CommunityCard
                key={post?.id}
                id={post?.id}
                title={post?.title}
                content={post?.content}
                createdAt={post?.createdAt}
                nickName={post?.nickName}
                uploadFileNames={post?.uploadFileNames}
                productDTOs={post?.productDTOs}
                sellerImage={post?.shopImage}
                hideSwiper={true}
                shopId={post?.shopId}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className={style.no_community}>등록된 커뮤니티 글이 없습니다.</p>
      )}
      <PostAddButton />
    </div>
  );
}

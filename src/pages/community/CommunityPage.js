import React, { useEffect, useState } from "react";
import { searchCommunity } from "../../api/searchApi";
import PostAddButton from "../../components/button/PostAddButton";
import CommunityCard from "../../components/card/CommunityCard";
import style from "../../styles/CommunityPage.module.css";
import { getMyProfile } from "../../api/memberApi";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [authorImage, setAuthorImage] = useState("");

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

  useEffect(() => {
    getMyProfile()
      .then((response) => {
        const { profileImage } = response.data;
        setAuthorImage(profileImage);
      })
      .catch((error) => {
        console.error("내 정보 불러오기 실패:", error);
      });
  }, []);

  return (
    <div className={style.community_container}>
      <h2>커뮤니티</h2>

      {posts.length > 0 ? (
        <div className={style.community_grid_wrapper}>
          <div className={style.community_grid_left}>
            {posts
              .filter((_, index) => index % 2 === 0)
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
                  sellerImage={
                    post?.shopImage !== null ? post?.shopImage : authorImage
                  }
                  shopId={post?.shopId}
                />
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

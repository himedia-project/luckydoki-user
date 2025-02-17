import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostInfo } from "../../api/communityApi";
import ImageLoader from "../../components/card/ImageLoader";

export default function CommunityDetailPage() {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostInfo = async () => {
      try {
        const response = await getPostInfo(id);
        setPostInfo(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostInfo();
  }, [id]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  if (!postInfo) {
    return <div>게시글 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div>
      <h1>{postInfo.title}</h1>
      <p>작성자: {postInfo.nickName}</p>
      <p>작성일: {postInfo.createdAt}</p>
      {postInfo.uploadFileNames && postInfo.uploadFileNames.length > 0 && (
        <div>
          {postInfo.uploadFileNames.map((filePath, index) => (
            <ImageLoader key={index} imagePath={filePath} alt="게시글 이미지" />
          ))}
        </div>
      )}
      <p>{postInfo.content}</p>
      {/* 필요하면 댓글, 좋아요, 태그된 상품 등 추가 */}
    </div>
  );
}

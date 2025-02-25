import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../api/imageApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DEFAULT_IMAGE = "/profile.png";

const ImageLoader = ({
  imagePath,
  alt = "이미지",
  className = "",
  onClick,
}) => {
  const [imageSrc, setImageSrc] = useState(null); // 🔥 초기값 `null`
  const [isLoading, setIsLoading] = useState(true); // 🔥 로딩 상태 추가

  useEffect(() => {
    if (imagePath) {
      getImageUrl(imagePath)
        .then((url) => {
          setImageSrc(url);
          setIsLoading(false);
        })
        .catch(() => {
          setImageSrc(DEFAULT_IMAGE);
          setIsLoading(false);
        });
    } else {
      setImageSrc(DEFAULT_IMAGE);
      setIsLoading(false);
    }
  }, [imagePath]);

  return (
    <>
      {isLoading ? (
        <Skeleton height={160} width="100%" className={className} />
      ) : (
        <img src={imageSrc} alt={alt} className={className} onClick={onClick} />
      )}
    </>
  );
};

export default ImageLoader;

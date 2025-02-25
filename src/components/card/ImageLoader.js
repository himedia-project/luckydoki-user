import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../api/imageApi";
import Skeleton from "../../components/skeleton/SkeletonImage"; // 스켈레톤 컴포넌트 추가

const DEFAULT_IMAGE = "/profile.png";

const ImageLoader = ({
  imagePath,
  alt = "이미지",
  className = "",
  onClick,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        <Skeleton className={className} />
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          className={className}
          onClick={onClick}
          onLoad={() => setIsLoading(false)}
        />
      )}
    </>
  );
};

export default ImageLoader;

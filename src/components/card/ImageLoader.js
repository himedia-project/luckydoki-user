import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../api/imageApi";

const DEFAULT_IMAGE = "/images/default_profile.png";

const ImageLoader = ({
  imagePath,
  alt = "이미지",
  className = "",
  onClick,
}) => {
  const [imageSrc, setImageSrc] = useState(DEFAULT_IMAGE);

  useEffect(() => {
    if (imagePath) {
      getImageUrl(imagePath)
        .then((url) => setImageSrc(url))
        .catch(() => setImageSrc(DEFAULT_IMAGE));
    }
  }, [imagePath]);

  return (
    <img src={imageSrc} alt={alt} className={className} onClick={onClick} />
  );
};

export default ImageLoader;

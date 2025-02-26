import React from "react";
import styles from "../../styles/SkeletonImage.module.css";

const SkeletonImage = ({ className }) => {
  return <div className={`${styles.skeleton} ${className}`} />;
};

export default SkeletonImage;

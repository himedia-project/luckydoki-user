import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import style from "../../styles/CategorySideMenu.module.css";

const CategorySkeleton = () => {
  return (
    <nav className={style.sideMenu}>
      <ul>
        {Array(5)
          .fill()
          .map((_, index) => (
            <li key={index} className={style.skeletonItem}>
              <div
                className={style.subCategory}
                style={{ display: "flex", flexDirection: "row" }}
              >
                <Skeleton width={120} height={18} />
                <Skeleton
                  width={24}
                  height={24}
                  style={{ marginLeft: "auto" }}
                />
              </div>
              <ul className={style.childCategoryList}>
                {Array(3)
                  .fill()
                  .map((_, childIndex) => (
                    <li key={childIndex} className={style.childCategoryItem}>
                      <Skeleton width={100} height={14} />
                    </li>
                  ))}
              </ul>
            </li>
          ))}
      </ul>
    </nav>
  );
};

export default CategorySkeleton;

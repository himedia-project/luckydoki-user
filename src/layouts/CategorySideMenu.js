import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoryHierarchy,
  toggleCategory,
  setExpandedCategory,
} from "../api/redux/categorySlice";
import style from "../styles/CategorySideMenu.module.css";
import CategorySkeleton from "../components/skeleton/CategorySkeleton";

const CategorySideMenu = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    parentCategory,
    subCategories,
    childCategories,
    expandedCategories,
    status,
  } = useSelector((state) => state.category);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchCategoryHierarchy(categoryId));
    }
  }, [categoryId, dispatch]);

  const activeChildInfo = useMemo(() => {
    for (const sub of subCategories || []) {
      const children = childCategories?.[sub.categoryId] || [];
      const child = children.find((child) => child.categoryId === categoryId);
      if (child) return { subCategoryId: sub.categoryId, child };
    }
    return null;
  }, [categoryId, subCategories, childCategories]);

  useEffect(() => {
    if (activeChildInfo) {
      dispatch(setExpandedCategory(activeChildInfo.subCategoryId));
    }
  }, [activeChildInfo, dispatch]);

  if (status === "loading") return <CategorySkeleton />;
  if (status === "failed")
    return <p>카테고리 데이터를 불러오는 데 실패했습니다.</p>;
  if (!parentCategory) return <p>카테고리 데이터가 없습니다.</p>;

  return (
    <nav className={style.sideMenu} key={JSON.stringify(expandedCategories)}>
      <ul>
        {subCategories.length === 0 ? (
          <li>카테고리 없음</li>
        ) : (
          subCategories.map((sub) => (
            <li key={sub.categoryId}>
              {/* 🔹 스타일 유지 (세로 변형 방지) */}
              <div
                className={`${style.subCategory} ${
                  expandedCategories[sub.categoryId] ? style.expanded : ""
                }`}
                style={{ display: "flex", flexDirection: "row" }} // ✅ 강제 적용하여 레이아웃 유지
                onClick={() => dispatch(toggleCategory(sub.categoryId))}
              >
                <span>{sub.name}</span>
                {childCategories?.[sub.categoryId]?.length > 0 && (
                  <button
                    className={style.toggleButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(toggleCategory(sub.categoryId));
                    }}
                    aria-label={
                      expandedCategories[sub.categoryId] ? "접기" : "펼치기"
                    }
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                )}
              </div>

              <ul
                className={`${style.childCategoryList} ${
                  expandedCategories[sub.categoryId] ? style.expanded : ""
                }`}
              >
                <li
                  className={`${style.childCategoryItem} ${
                    parseInt(sub.categoryId) === parseInt(categoryId)
                      ? style.active
                      : ""
                  }`}
                  onClick={(e) => {
                    navigate(`/category/${sub.categoryId}`);
                    dispatch(setExpandedCategory(sub.categoryId));
                  }}
                >
                  전체
                </li>
                {childCategories?.[sub.categoryId]?.map((child) => (
                  <li
                    key={child.categoryId}
                    className={`${style.childCategoryItem} ${
                      parseInt(child.categoryId) === parseInt(categoryId)
                        ? style.active
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();

                      dispatch(setExpandedCategory(sub.categoryId));

                      navigate(`/category/${child.categoryId}`);
                    }}
                  >
                    {child.name}
                  </li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>
    </nav>
  );
};

export default CategorySideMenu;

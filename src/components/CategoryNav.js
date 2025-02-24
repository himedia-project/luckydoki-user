import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSubCategories, getChildCategories } from "../api/categoryApi";
import style from "../styles/CategoryNav.module.css";
import { useDispatch } from "react-redux";
import { setExpandedCategory } from "../api/redux/categorySlice";

const CategoryNav = ({
  activeCategory,
  isDropdownVisible,
  setDropdownVisible,
}) => {
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (!activeCategory) {
      setSubCategories([]);
      setChildCategories({});
      return;
    }

    const fetchSubCategories = async () => {
      try {
        const subResponse = await getSubCategories(activeCategory);
        if (!subResponse.data || subResponse.data.length === 0) return;
        setSubCategories(subResponse.data);
      } catch (error) {
        console.error("서브 카테고리 불러오기 실패:", error);
      }
    };

    fetchSubCategories();
  }, [activeCategory]);

  useEffect(() => {
    if (subCategories.length === 0) return;

    const fetchChildCategories = async () => {
      try {
        const childData = {};
        await Promise.all(
          subCategories.map(async (sub) => {
            if (!sub.categoryId) return;
            const childResponse = await getChildCategories(sub.categoryId);
            childData[sub.categoryId] = childResponse.data;
          })
        );
        setChildCategories(childData);
      } catch (error) {
        console.error("자식 카테고리 불러오기 실패:", error);
      }
    };

    fetchChildCategories();
  }, [subCategories]);

  const handleCategoryClick = (subId) => {
    dispatch(setExpandedCategory(subId));
    setDropdownVisible(false); // 드롭박스 닫기
  };

  return (
    <div
      className={`${style.category_wrapper} ${
        isDropdownVisible ? style.visible : ""
      }`}
    >
      {subCategories.length > 0 ? (
        <div className={style.dropdown}>
          <ul className={style.sub_categories}>
            {subCategories.map((sub) => (
              <li key={sub.categoryId} className={style.sub_item}>
                {sub.name}
                {/* 🔹 "전체" 링크 추가 */}
                <ul className={style.child_categories}>
                  <li
                    key={`${sub.categoryId}-all`}
                    className={style.child_item}
                    onClick={() => handleCategoryClick(sub.categoryId)}
                  >
                    <Link to={`/category/${sub.categoryId}`}>전체</Link>
                  </li>
                  {/* 🔹 기존 자식 카테고리 리스트 */}
                  {(childCategories[sub.categoryId] || []).map((child) => (
                    <li
                      key={child.categoryId}
                      className={style.child_item}
                      onClick={() => handleCategoryClick(sub.categoryId)}
                    >
                      <Link to={`/category/${child.categoryId}`}>
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>로딩 중...</p> // 🔹 데이터를 기다리는 동안 메시지 표시
      )}
    </div>
  );
};

export default CategoryNav;

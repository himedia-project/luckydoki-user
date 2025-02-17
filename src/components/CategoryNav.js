import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSubCategories, getChildCategories } from "../api/categoryApi";
import style from "../styles/CategoryNav.module.css";

const CategoryNav = ({ activeCategory, isDropdownVisible }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState({});

  useEffect(() => {
    console.log("Active Category Changed:", activeCategory);

    if (!activeCategory) {
      setSubCategories([]);
      setChildCategories({});
      return;
    }

    const fetchSubCategories = async () => {
      try {
        console.log("Fetching SubCategories for:", activeCategory);
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
    console.log("SubCategories Updated:", subCategories);

    if (subCategories.length === 0) return;

    const fetchChildCategories = async () => {
      try {
        const childData = {};
        await Promise.all(
          subCategories.map(async (sub) => {
            if (!sub.categoryId) return;
            console.log("Fetching ChildCategories for:", sub.categoryId);
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
                  >
                    <Link to={`/category/${sub.categoryId}`}>전체</Link>
                  </li>
                  {/* 🔹 기존 자식 카테고리 리스트 */}
                  {(childCategories[sub.categoryId] || []).map((child) => (
                    <li key={child.categoryId} className={style.child_item}>
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

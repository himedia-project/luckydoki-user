import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSubCategories, getChildCategories } from "../api/categoryApi";
import style from "../styles/CategorySideMenu.module.css";

const CategorySideMenu = () => {
  const { categoryId } = useParams();
  const [subCategories, setSubCategories] = useState([]); // 🔹 서브 카테고리

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await getSubCategories(categoryId);
        setSubCategories(response.data);
      } catch (error) {
        console.error("서브 카테고리 불러오기 실패:", error);
      }
    };

    fetchSubCategories();
  }, [categoryId]);

  return (
    <nav className={style.sideMenu}>
      <ul>
        {/* ✅ "전체" 카테고리 버튼 추가 */}
        {subCategories.length > 0 && (
          <li>
            <Link to={`/category/${categoryId}`} className={style.active}>
              전체
            </Link>
          </li>
        )}

        {/* ✅ 서브 카테고리 (기존) */}
        {subCategories.map((sub) => (
          <li key={sub.categoryId}>
            <Link
              to={`/category/${sub.categoryId}`}
              className={
                sub.categoryId === Number(categoryId) ? style.active : ""
              }
            >
              {sub.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategorySideMenu;

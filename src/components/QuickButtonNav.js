import React, { useEffect, useState } from "react";
import style from "../styles/QuickButtonNav.module.css";
import { useNavigate } from "react-router-dom";
import { getMainCategories, getSubCategories } from "../api/categoryApi";
import ImageLoader from "../components/card/ImageLoader";
import SkeletonQuickButton from "../components/skeleton/SkeletonQuickButton"; // 🔥 스켈레톤 추가

export default function QuickButtonNav() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 🔥 로딩 상태 추가

  useEffect(() => {
    const fetchCategoriesAndSubs = async () => {
      try {
        const mainResponse = await getMainCategories();
        const mainCategories = mainResponse.data;

        const categoriesWithSubs = await Promise.all(
          mainCategories.map(async (category) => {
            const subResponse = await getSubCategories(category.categoryId);
            return { ...category, subCategories: subResponse.data };
          })
        );

        setCategories(categoriesWithSubs);
      } catch (error) {
        console.error("카테고리 데이터를 가져오는 중 에러 발생:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 500); // ✅ 최소 500ms 유지하여 자연스럽게 전환
      }
    };

    fetchCategoriesAndSubs();
  }, []);

  console.log(categories);

  const handleCategoryClick = (subCategoryId) => {
    navigate(`/category/${subCategoryId}`);
  };

  const handleAIClick = () => {
    navigate("/ai_suggest");
  };

  return (
    <div className={style.buttonContainer}>
      {isLoading ? (
        <SkeletonQuickButton /> // ✅ 로딩 중이면 스켈레톤 표시
      ) : (
        <ul className={style.buttonNav}>
          {categories.slice(0, 3).flatMap((category) =>
            category.subCategories.slice(0, 3).map((subCategory, index) => (
              <li
                key={index}
                className={style.LinkButton}
                onClick={() => handleCategoryClick(subCategory.categoryId)}
              >
                <div className={style.imageContainer}>
                  <ImageLoader imagePath={subCategory.logo} />
                </div>
                <p>{subCategory.name}</p>
              </li>
            ))
          )}
          <li className={style.LinkButton} onClick={() => handleAIClick()}>
            <div className={style.imageContainer}>
              <img src="/ailogo.png" alt="" />
            </div>
            <p>AI추천</p>
          </li>
        </ul>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import style from "../styles/QuickButtonNav.module.css";
import { useNavigate } from "react-router-dom";
import { getMainCategories, getSubCategories } from "../api/categoryApi";
import ImageLoader from "../components/card/ImageLoader";

export default function QuickButtonNav() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

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
      <ul className={style.buttonNav}>
        <li
          className={style.LinkButton}
          onClick={() =>
            handleCategoryClick(categories[0]?.subCategories[0]?.categoryId)
          }
        >
          <div className={style.imageContainer}>
            <ImageLoader imagePath={categories[0]?.subCategories[0]?.logo} />
          </div>
          <p>{categories[0]?.subCategories[0]?.name}</p>
        </li>
        <li
          className={style.LinkButton}
          onClick={() =>
            handleCategoryClick(categories[0]?.subCategories[1]?.categoryId)
          }
        >
          <div className={style.imageContainer}>
            <ImageLoader imagePath={categories[0]?.subCategories[1]?.logo} />
          </div>
          <p>{categories[0]?.subCategories[1]?.name}</p>
        </li>
        <li
          className={style.LinkButton}
          onClick={() =>
            handleCategoryClick(categories[0]?.subCategories[2]?.categoryId)
          }
        >
          <div className={style.imageContainer}>
            <ImageLoader imagePath={categories[0]?.subCategories[2]?.logo} />
          </div>
          <p>{categories[0]?.subCategories[2]?.name}</p>
        </li>
        <li
          className={style.LinkButton}
          onClick={() =>
            handleCategoryClick(categories[1]?.subCategories[0]?.categoryId)
          }
        >
          <div className={style.imageContainer}>
            <ImageLoader imagePath={categories[1]?.subCategories[0]?.logo} />
          </div>
          <p>{categories[1]?.subCategories[0]?.name}</p>
        </li>
        <li
          className={style.LinkButton}
          onClick={() =>
            handleCategoryClick(categories[1]?.subCategories[1]?.categoryId)
          }
        >
          <div className={style.imageContainer}>
            <ImageLoader imagePath={categories[1]?.subCategories[1]?.logo} />
          </div>
          <p>{categories[1]?.subCategories[1]?.name}</p>
        </li>
        <li
          className={style.LinkButton}
          onClick={() =>
            handleCategoryClick(categories[1]?.subCategories[2]?.categoryId)
          }
        >
          <div className={style.imageContainer}>
            <ImageLoader imagePath={categories[1]?.subCategories[2]?.logo} />
          </div>
          <p>{categories[1]?.subCategories[2]?.name}</p>
        </li>
        <li
          className={style.LinkButton}
          onClick={() =>
            handleCategoryClick(categories[2]?.subCategories[0]?.categoryId)
          }
        >
          <div className={style.imageContainer}>
            <ImageLoader imagePath={categories[2]?.subCategories[0]?.logo} />
          </div>
          <p>{categories[2]?.subCategories[0]?.name}</p>
        </li>
        <li
          className={style.LinkButton}
          onClick={() =>
            handleCategoryClick(categories[2]?.subCategories[1]?.categoryId)
          }
        >
          <div className={style.imageContainer}>
            <ImageLoader imagePath={categories[2]?.subCategories[1]?.logo} />
          </div>
          <p>{categories[2]?.subCategories[1]?.name}</p>
        </li>
        <li
          className={style.LinkButton}
          onClick={() =>
            handleCategoryClick(categories[2]?.subCategories[2]?.categoryId)
          }
        >
          <div className={style.imageContainer}>
            <ImageLoader imagePath={categories[2]?.subCategories[2]?.logo} />
          </div>
          <p>{categories[2]?.subCategories[2]?.name}</p>
        </li>
        <li className={style.LinkButton} onClick={() => handleAIClick()}>
          <div className={style.imageContainer}>
            <img src="/ailogo.png" alt="" />
          </div>
          <p>AI추천</p>
        </li>
      </ul>
    </div>
  );
}

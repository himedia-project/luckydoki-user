import React from "react";
import style from "../styles/QuickButtonNav.module.css";
import { useNavigate } from "react-router-dom";

export default function QuickButtonNav() {
  const navigate = useNavigate();

  const handleCategoryClick = () => {};

  const handleAIClick = () => {};

  return (
    <div className={style.buttonContainer}>
      <ul className={style.buttonNav}>
        <li className={style.LinkButton}>
          <div className={style.imageContainer}>
            <img src="/profile.png" alt="" />
          </div>
          <p>주얼리</p>
        </li>
        <li className={style.LinkButton}>
          <div className={style.imageContainer}>
            <img src="/profile.png" alt="" />
          </div>
          <p>의류</p>
        </li>
        <li className={style.LinkButton}>
          <div className={style.imageContainer}>
            <img src="/profile.png" alt="" />
          </div>
          <p>패션잡화</p>
        </li>
        <li className={style.LinkButton}>
          <div className={style.imageContainer}>
            <img src="/profile.png" alt="" />
          </div>
          <p>케이스/액세서리</p>
        </li>
        <li className={style.LinkButton}>
          <div className={style.imageContainer}>
            <img src="/profile.png" alt="" />
          </div>
          <p>문구/취미</p>
        </li>
        <li className={style.LinkButton}>
          <div className={style.imageContainer}>
            <img src="/profile.png" alt="" />
          </div>
          <p>기념일/파티</p>
        </li>
        <li className={style.LinkButton}>
          <div className={style.imageContainer}>
            <img src="/profile.png" alt="" />
          </div>
          <p>사료/간식</p>
        </li>
        <li className={style.LinkButton}>
          <div className={style.imageContainer}>
            <img src="/profile.png" alt="" />
          </div>
          <p>반려패션</p>
        </li>
        <li className={style.LinkButton}>
          <div className={style.imageContainer}>
            <img src="/profile.png" alt="" />
          </div>
          <p>반려용품</p>
        </li>
        <li className={style.LinkButton}>
          <div className={style.imageContainer}>
            <img src="/profile.png" alt="" />
          </div>
          <p>AI추천</p>
        </li>
      </ul>
    </div>
  );
}

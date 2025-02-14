import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSellerInfo } from "../api/shopApi";
import { likeShop } from "../api/likesApi"; // 찜 API 추가
import style from "../styles/ShopPage.module.css";
import Swal from "sweetalert2";

export default function ShopPage() {
  const { shopId } = useParams();
  const [sellerInfo, setSellerInfo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("판매상품");

  useEffect(() => {
    if (shopId) {
      getSellerInfo(shopId)
        .then((response) => {
          setSellerInfo(response.data);
          setIsLiked(response.data.likes);
        })
        .catch((error) => {
          console.error("Seller info 조회 실패:", error);
        });
    }
  }, [shopId]);

  const toggleLike = async () => {
    try {
      const response = await likeShop(shopId);
      if (response.data) {
        const updatedLikeStatus = response.data.liked;
        setIsLiked(updatedLikeStatus);

        Swal.fire({
          toast: true,
          position: "top",
          icon: updatedLikeStatus ? "success" : "info",
          title: updatedLikeStatus
            ? "찜목록에 추가되었습니다."
            : "찜 목록에서 삭제되었습니다.",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: false,
        });
      }
    } catch (error) {
      console.error("찜 상태 변경 실패:", error);
      Swal.fire({
        toast: true,
        position: "top",
        title: "찜 상태 변경에 실패하였습니다.",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: false,
      });
    }
  };

  return (
    <div>
      <div className={style.shop_top}>
        <div className={style.shop_info}>
          <div className={style.seller_info}>
            <img src={sellerInfo?.image} alt="" />
            <p>{sellerInfo?.nickName}</p>
          </div>
          <p>{sellerInfo?.introduction}</p>
          <button
            className={`${style.wish_button} ${isLiked ? style.liked : ""}`}
            onClick={toggleLike}
          >
            {isLiked ? "✓ 찜한 샵" : "+ 찜"}
          </button>
        </div>
      </div>
      <div className={style.shop_nav}>
        <p
          className={`${style.nav_button} ${
            activeTab === "커뮤니티" ? style.active : ""
          }`}
          onClick={() => setActiveTab("커뮤니티")}
        >
          커뮤니티
        </p>
        <p
          className={`${style.nav_button} ${
            activeTab === "판매상품" ? style.active : ""
          }`}
          onClick={() => setActiveTab("판매상품")}
        >
          판매상품
        </p>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { likeShop } from "../api/likesApi";
import {
  getCommunityPosts,
  getSellerInfo,
  getShopProducts,
} from "../api/shopApi";
import style from "../styles/ShopPage.module.css";

import ImageLoader from "../components/card/ImageLoader";
import useLikeToggle from "../hooks/useLikeToggle";
import ProductCard from "../components/card/ProductCard";
import { useSelector } from "react-redux";
import CommunityCard from "../components/card/CommunityCard";

export default function ShopPage() {
  const navigate = useNavigate();
  const { shopId } = useParams();
  const userNickname = useSelector((state) => state.loginSlice.nickName);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [data, setData] = useState([]);
  const [isLiked, toggleLike, setIsLiked] = useLikeToggle(
    false,
    likeShop,
    shopId
  );
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

      if (activeTab === "판매상품") {
        getShopProducts(shopId)
          .then((response) => {
            setData(response.data.productList || []);
          })
          .catch((error) => {
            console.error("상품 리스트 조회 실패:", error);
          });
      } else if (activeTab === "커뮤니티") {
        getCommunityPosts(shopId)
          .then((response) => {
            setData(response.data.communityList || []);
          })
          .catch((error) => {
            console.error("커뮤니티 글 조회 실패:", error);
          });
      }
    }
  }, [shopId, activeTab, setIsLiked]);

  const handleAddProduct = () => {
    console.log("상품 추가 버튼 클릭됨");
    navigate("/product_add");
  };

  const handleDeleteProduct = () => {
    console.log("상품 삭제 버튼 클릭됨");
    // TODO: 상품 삭제 로직 구현
  };

  return (
    <div>
      <div className={style.shop_top}>
        <div className={style.shop_info}>
          <div className={style.seller_info}>
            <ImageLoader imagePath={sellerInfo?.image} alt="프로필 이미지" />
            <p>{sellerInfo?.nickName}</p>
          </div>
          <p>{sellerInfo?.introduction}</p>

          {userNickname === sellerInfo?.nickName ? (
            <div className={style.owner_buttons}>
              <button className={style.add_button} onClick={handleAddProduct}>
                + 상품 추가
              </button>
              <button
                className={style.delete_button}
                onClick={handleDeleteProduct}
              >
                상품 삭제
              </button>
            </div>
          ) : (
            <button
              className={`${style.wish_button} ${isLiked ? style.liked : ""}`}
              onClick={toggleLike}
            >
              {isLiked ? "✓ 찜한 샵" : "+ 찜"}
            </button>
          )}
        </div>
      </div>

      {/* 네비게이션 바 */}
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

      {/* 탭에 따라 데이터 출력 */}
      {activeTab === "판매상품" ? (
        <div className={style.product_list}>
          {data.length > 0 ? (
            <div className={style.product_grid}>
              {data.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  discountPrice={product.discountPrice || product.price}
                  discountRate={product.discountRate || 0}
                  productImageUrl={product.uploadFileNames?.[0]}
                  isNew={product.isNew === "Y"}
                  event={product.event === "Y"}
                  best={product.best === "Y"}
                  likes={product.likes}
                  onUnlike={() => console.log(`상품 ${product.id} 찜 해제`)}
                />
              ))}
            </div>
          ) : (
            <p className={style.no_products}>등록된 상품이 없습니다.</p>
          )}
        </div>
      ) : (
        <div className={style.community_list}>
          {data.length > 0 ? (
            <div className={style.community_grid_wrapper}>
              <div className={style.community_grid_left}>
                {data.slice(0, Math.ceil(data.length / 2)).map((post) => (
                  <CommunityCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    content={post.content}
                    createdAt={post.createdAt}
                    nickName={post.nickName}
                    uploadFileNames={post.uploadFileNames}
                    productDTOs={post.productDTOs}
                    sellerImage={sellerInfo?.image}
                  />
                ))}
              </div>

              <div className={style.community_grid_right}>
                {data.slice(Math.ceil(data.length / 2)).map((post) => (
                  <CommunityCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    content={post.content}
                    createdAt={post.createdAt}
                    nickName={post.nickName}
                    uploadFileNames={post.uploadFileNames}
                    productDTOs={post.productDTOs}
                    sellerImage={sellerInfo?.image}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className={style.no_community}>등록된 커뮤니티 글이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

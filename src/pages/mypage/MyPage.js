import React, { useEffect, useState } from "react";
import style from "../../styles/MyPage.module.css";
import { Link } from "react-router-dom";
import { getMyProfile } from "../../api/memberApi";
import { getLikedShops, getLikedProducts } from "../../api/likesApi";
import ProductCard from "../../components/card/ProductCard";
import ShopCard from "../../components/card/ShopCard";

export default function MyPage() {
  const [userInfo, setUserInfo] = useState({
    nickname: "",
    email: "",
  });
  const [likedShops, setLikedShops] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
    getMyProfile()
      .then((response) => {
        const { nickName, email } = response.data;
        setUserInfo({
          nickname: nickName,
          email: email,
        });
      })
      .catch((error) => {
        console.error("내 정보 가져오기 실패:", error);
      });

    getLikedProducts()
      .then((res) => {
        setLikedProducts(res.data);
      })
      .catch((err) => {
        console.error("찜한 상품 조회 실패:", err);
      });

    getLikedShops()
      .then((res) => {
        setLikedShops(res.data);
      })
      .catch((err) => {
        console.error("찜한 샵 조회 실패:", err);
      });
  }, []);

  const handleUnlikeProduct = (id) => {
    setLikedProducts((prevProducts) =>
      prevProducts.filter((p) => p.productId !== id)
    );
  };

  const handleUnlikeShop = (id) => {
    setLikedShops((prevShops) =>
      prevShops.filter((shop) => shop.shopId !== id)
    );
  };

  return (
    <div className={style.mypage_container}>
      {/* ---- 상단 유저 정보 ---- */}
      <div className={style.userinfo_container}>
        <div className={style.userinfo_top}>
          <div className={style.text_box}>
            <p>{userInfo.nickname}</p>
            <span>님 반갑습니다</span>
          </div>
          <div className={style.black_bar}></div>
        </div>
        <div className={style.userinfo_middle}>
          <div className={style.user_data}>
            <img src="profile.png" />
            <div className={style.userinfo}>
              <p>{userInfo.email}</p>
              <Link to="/userinfo">내 정보 변경</Link>
            </div>
          </div>
          <div className={style.coupon_box}>
            <div className={style.box}>
              <p>포인트</p>
              <p>0</p>
            </div>
            <div className={style.bar}></div>
            <Link to="/coupon" className={style.box}>
              <p>쿠폰</p>
              <p>0</p>
            </Link>
            <div className={style.bar}></div>
            <div className={style.box}>
              <p>응모권</p>
              <p>0</p>
            </div>
          </div>
        </div>
        <div className={style.userinfo_bottom}></div>
      </div>

      {/* ---- 찜한 상품 ---- */}
      <div className={style.wishlist_container}>
        <div className={style.wish_header}>
          <h3>찜한 상품</h3>
          <Link to="/likeslist">더보기</Link>
        </div>
        <div className={style.wish_content}>
          {likedProducts && likedProducts.length > 0 ? (
            <div className={style.product_grid}>
              {likedProducts.map((product) => (
                <ProductCard
                  key={product.productId}
                  id={product.productId}
                  name={product.productName}
                  price={product.price}
                  discountPrice={product.discountPrice}
                  discountRate={product.discountRate}
                  productImageUrl={product.productImageUrl}
                  isNew={product.isNew === "Y"}
                  event={product.event === "Y"}
                  best={product.best === "Y"}
                  likes={product.likes}
                  onUnlike={handleUnlikeProduct}
                />
              ))}
            </div>
          ) : (
            <p>찜한 상품이 없습니다.</p>
          )}
        </div>
      </div>

      {/* ---- 찜한 샵 ---- */}
      <div className={style.wishlist_container}>
        <div className={style.wish_header}>
          <h3>찜한 샵</h3>
          <Link to="/likeslist">더보기</Link>
        </div>
        <div className={style.wish_content}>
          {likedShops && likedShops.length > 0 ? (
            <div className={style.shop_grid}>
              {likedShops.map((shop) => (
                <ShopCard
                  key={shop.shopId}
                  shopId={shop.shopId}
                  sellerNickname={shop.sellerNickname}
                  shopImageUrl={shop.shopImageUrl}
                  likes={shop.likes}
                  onUnlike={handleUnlikeShop}
                />
              ))}
            </div>
          ) : (
            <p>찜한 샵이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

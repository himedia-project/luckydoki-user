import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import ProductCard from "../../components/card/ProductCard";
import ShopCard from "../../components/card/ShopCard";
import { useLikedItems } from "../../hooks/useLikedItems";
import style from "../../styles/MyPage.module.css";
import ImageLoader from "../../components/card/ImageLoader";

export default function MyPage() {
  const { userInfo } = useOutletContext();
  const { likedProducts, likedShops, handleUnlikeProduct, handleUnlikeShop } =
    useLikedItems();

  return (
    <div className={style.mypage_container}>
      {/* ---- 상단 유저 정보 ---- */}
      <div className={style.userinfo_container}>
        <div className={style.userinfo_top}>
          <div className={style.text_box}>
            <p>{userInfo?.nickName}</p>
            <span>님 반갑습니다</span>
          </div>
          <div className={style.black_bar}></div>
        </div>
        <div className={style.userinfo_middle}>
          <div className={style.user_data}>
            <ImageLoader imagePath={userInfo?.profileImage} />
            <div className={style.userinfo}>
              <p>{userInfo?.email}</p>
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
              <p>{userInfo?.activeCouponCount ?? 0}</p>
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
          <Link to="/likeslist" state={{ tab: "product" }}>
            더보기
          </Link>
        </div>
        <div className={style.wish_content}>
          {likedProducts && likedProducts.length > 0 ? (
            <div className={style.product_grid}>
              {likedProducts.map((product) => (
                <ProductCard
                  key={product?.productId}
                  id={product?.productId}
                  name={product?.productName}
                  price={product?.price}
                  discountPrice={product?.discountPrice}
                  discountRate={product?.discountRate}
                  productImageUrl={product?.productImageUrl}
                  isNew={product?.isNew === "Y"}
                  event={product?.event === "Y"}
                  best={product?.best === "Y"}
                  likes={product?.likes}
                  onUnlike={handleUnlikeProduct}
                  reviewAverage={product?.reviewAverage}
                  reviewCount={product?.reviewCount}
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
          <Link to="/likeslist" state={{ tab: "shop" }}>
            더보기
          </Link>
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

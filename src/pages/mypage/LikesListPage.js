import React, { useEffect, useState } from "react";
import style from "../../styles/likesList.module.css";
import { getLikedProducts, getLikedShops } from "../../api/likesApi";
import ProductCard from "../../components/card/ProductCard";
import ShopCard from "../../components/card/ShopCard";

export default function LikesListPage() {
  const [selectedTab, setSelectedTab] = useState("product");
  const [likedProducts, setLikedProducts] = useState([]);
  const [likedShops, setLikedShops] = useState([]);

  useEffect(() => {
    if (selectedTab === "product") {
      getLikedProducts()
        .then((res) => {
          setLikedProducts(res.data);
        })
        .catch((err) => {
          console.error("찜한 상품 목록 조회 실패:", err);
          setLikedProducts([]);
        });
    } else {
      getLikedShops()
        .then((res) => {
          setLikedShops(res.data);
        })
        .catch((err) => {
          console.error("찜한 샵 목록 조회 실패:", err);
          setLikedShops([]);
        });
    }
  }, [selectedTab]);

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
    <div className={style.wish_container}>
      <h2>찜목록</h2>

      {/* 탭 버튼 */}
      <div className={style.tab_container}>
        <button
          className={selectedTab === "product" ? style.activeTab : style.tab}
          onClick={() => setSelectedTab("product")}
        >
          상품
        </button>
        <button
          className={selectedTab === "shop" ? style.activeTab : style.tab}
          onClick={() => setSelectedTab("shop")}
        >
          샵
        </button>
      </div>

      {/* 탭 내용 */}
      <div className={style.content_box}>
        {selectedTab === "product" && (
          <>
            {likedProducts && likedProducts.length > 0 ? (
              <div className={style.product_grid}>
                {likedProducts.map((item) => (
                  <ProductCard
                    key={item.productId}
                    id={item.productId}
                    name={item.productName}
                    price={item.price}
                    discountPrice={item.discountPrice}
                    discountRate={item.discountRate}
                    productImageUrl={item.productImageUrl}
                    likes={item.likes}
                    isNew={item.isNew === "Y"}
                    event={item.event === "Y"}
                    best={item.best === "Y"}
                    onUnlike={handleUnlikeProduct}
                  />
                ))}
              </div>
            ) : (
              <p>찜한 상품이 없습니다.</p>
            )}
          </>
        )}

        {/* 샵 탭 */}
        {selectedTab === "shop" && (
          <div className={style.shop_container}>
            {likedShops && likedShops.length > 0 ? (
              likedShops.map((shop) => (
                <ShopCard
                  key={shop.shopId}
                  likes={shop.likes}
                  shopId={shop.shopId}
                  sellerNickname={shop.sellerNickname}
                  shopImageUrl={shop.shopImageUrl}
                  onUnlike={handleUnlikeShop}
                />
              ))
            ) : (
              <p>찜한 샵이 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

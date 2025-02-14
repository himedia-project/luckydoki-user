import { useState, useEffect } from "react";
import { getLikedProducts, getLikedShops } from "../api/likesApi";

export function useLikedItemsTab() {
  const [selectedTab, setSelectedTab] = useState("product");
  const [likedProducts, setLikedProducts] = useState([]);
  const [likedShops, setLikedShops] = useState([]);

  useEffect(() => {
    if (selectedTab === "product") {
      getLikedProducts()
        .then((res) => setLikedProducts(res.data))
        .catch((err) => {
          console.error("찜한 상품 조회 실패:", err);
          setLikedProducts([]);
        });
    } else {
      getLikedShops()
        .then((res) => setLikedShops(res.data))
        .catch((err) => {
          console.error("찜한 샵 조회 실패:", err);
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

  return {
    selectedTab,
    setSelectedTab,
    likedProducts,
    likedShops,
    handleUnlikeProduct,
    handleUnlikeShop,
  };
}

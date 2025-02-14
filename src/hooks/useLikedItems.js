import { useEffect, useState } from "react";
import { getLikedProducts, getLikedShops } from "../api/likesApi";

export function useLikedItems() {
  const [likedShops, setLikedShops] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
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

  return { likedProducts, likedShops, handleUnlikeProduct, handleUnlikeShop };
}

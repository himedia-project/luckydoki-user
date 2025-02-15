import { useEffect, useState } from "react";
import { getLikedProducts, getLikedShops } from "../api/likesApi";
import Swal from "sweetalert2";

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

    Swal.fire({
      toast: true,
      position: "top",
      icon: "info",
      title: "찜 목록에서 삭제되었습니다.",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: false,
      didOpen: () => {
        const swalPopup = Swal.getPopup();
        if (swalPopup) {
          swalPopup.style.zIndex = "10000";
        }
      },
    });
  };

  const handleUnlikeShop = (id) => {
    setLikedShops((prevShops) =>
      prevShops.filter((shop) => shop.shopId !== id)
    );

    Swal.fire({
      toast: true,
      position: "top",
      icon: "info",
      title: "찜 목록에서 삭제되었습니다.",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: false,
      didOpen: () => {
        const swalPopup = Swal.getPopup();
        if (swalPopup) {
          swalPopup.style.zIndex = "10000";
        }
      },
    });
  };

  return { likedProducts, likedShops, handleUnlikeProduct, handleUnlikeShop };
}

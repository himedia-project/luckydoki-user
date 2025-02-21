import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { addCartItem } from "../api/cartApi";
import { getOrderList } from "../api/orderApi";
import { getProductInfo, validateCount } from "../api/productApi";
import { getReviewByProduct } from "../api/reviewApi";
import LikeButton from "../components/button/LikeButton";
import MessageButton from "../components/button/MessageButton";
import ImageLoader from "../components/card/ImageLoader";
import ReviewCard from "../components/card/ReviewCard";
import ReviewRating from "../components/ReviewRating";
import style from "../styles/ProductDetail.module.css";
import { addCartItems } from "../api/redux/cartSlice";

export default function ProductDetail() {
  const navigate = useNavigate();
  const email = useSelector((state) => state.loginSlice.email);
  const dispatch = useDispatch();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [orders, setOrders] = useState([]);
  const productInfoRef = useRef(null);
  const reviewSectionRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductInfo(productId);
        setProduct(response.data);
        setMainImage(response.data.uploadFileNames[0]);
      } catch (error) {
        console.error("상품 정보를 불러오지 못했습니다.", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await getReviewByProduct(productId);
        setReviews(response.data || []);
      } catch (error) {
        console.error("리뷰를 불러오는 데 실패했습니다.", error);
      }
    };

    const fetchOrders = async () => {
      if (!email) return;
      try {
        const response = await getOrderList();
        setOrders(response.data);
      } catch (error) {
        console.error("주문 내역을 불러오는 데 실패했습니다.", error);
      }
    };

    fetchProduct();
    fetchReviews();
    fetchOrders();
  }, [productId]);

  // 가격 계산
  const totalPrice = (product?.discountPrice * quantity).toLocaleString();
  const isDiscounted = product?.discountRate > 0;

  const handleMoveReviewAdd = () => {
    if (!email) {
      Swal.fire({
        toast: true,
        position: "top",
        title: "로그인이 필요합니다.",
        icon: "warning",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: false,
      });
      return;
    }

    const hasPurchased = orders.some((order) =>
      order.orderItems.some((item) => item.productId === Number(productId))
    );

    if (!hasPurchased) {
      Swal.fire({
        toast: true,
        position: "top",
        title: "구매한 사용자만 리뷰를 작성할 수 있습니다.",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: false,
      });
      return;
    }

    navigate("/review_add", {
      state: {
        productImage: product?.uploadFileNames[0],
        productName: product?.name,
        productId: product?.id,
      },
    });
  };

  const handleAddToCart = async () => {
    if (!email) {
      Swal.fire({
        toast: true,
        position: "top",
        title: "로그인이 필요합니다.",
        icon: "warning",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: false,
      });
      return;
    }

    try {
      // 재고 수량 검증
      await validateCount(productId, quantity);
      const response = await addCartItem(productId, quantity);
      // console.log(response);

      // redux에 장바구니 상품 추가
      dispatch(addCartItems(response));

      const result = await Swal.fire({
        title: "장바구니에 추가되었습니다.",
        text: "장바구니로 이동하시겠습니까?",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "확인",
        cancelButtonText: "아니요",
      });

      if (result.isConfirmed) {
        navigate("/cart");
      }
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      const errorMessage =
        error.response?.data?.errMsg || "장바구니 추가에 실패했습니다.";
      Swal.fire({
        title: "재고 부족",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  const handleAddToPayment = async () => {
    if (!email) {
      Swal.fire({
        toast: true,
        position: "top",
        title: "로그인이 필요합니다.",
        icon: "warning",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: false,
      });
      return;
    }

    try {
      // 재고 수량 검증
      await validateCount(productId, quantity);

      const selectedProducts = [
        {
          productId: product.id,
          productName: product.name,
          imageName: product.uploadFileNames[0],
          price: product.price,
          discountPrice: product.discountPrice,
          discountRate: product.discountRate,
          qty: quantity,
        },
      ];

      const totalAmount = product.discountPrice * quantity;

      navigate("/payment", {
        state: {
          selectedProducts,
          totalAmount,
        },
      });
    } catch (error) {
      console.error("재고 확인 실패:", error);
      const errorMessage =
        error.response?.data?.errMsg || "재고 확인에 실패했습니다.";
      Swal.fire({
        title: "재고 부족",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  // const handleScrollToSection = (ref) => {
  //   if (ref.current) {
  //     const elementPosition =
  //       ref.current.getBoundingClientRect().top + window.scrollY;
  //     window.scrollTo({
  //       top: elementPosition - 110,
  //       behavior: "smooth",
  //     });
  //   }
  // };

  const handleMoveShop = () => {
    navigate(`/shop/${product?.shopId}`);
  };

  return (
    <div className={style.container}>
      {/* 왼쪽 섹션 */}
      <section className={style.leftSection}>
        <div className={style.imageContainer}>
          {/* 상품 대표 이미지 */}
          <ImageLoader
            imagePath={mainImage}
            alt={product?.name}
            className={style.mainImage}
          />
          {/* 썸네일 이미지 리스트 */}
          <div className={style.thumbnailContainer}>
            {product?.uploadFileNames.map((img, index) => (
              <ImageLoader
                key={index}
                imagePath={img}
                alt={`상품 이미지 ${index + 1}`}
                className={`${style.thumbnail} ${
                  img === mainImage ? style.activeThumbnail : ""
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* 사이드바 */}
        {/* <div className={style.sidebar}>
          <button
            className={style.sidebarButton}
            onClick={() => handleScrollToSection(productInfoRef)}
          >
            상품정보
          </button>
          <button
            className={style.sidebarButton}
            onClick={() => handleScrollToSection(reviewSectionRef)}
          >
            상품리뷰
          </button>
        </div> */}

        {/* 상품 정보 */}
        <div className={style.productDescription} ref={productInfoRef}>
          <p>{product?.description}</p>
        </div>

        {/* 리뷰 */}
        <div className={style.reviewSection} ref={reviewSectionRef}>
          <div className={style.review_top}>
            <h3>상품 리뷰 ({reviews.length})</h3>
            <p
              className={style.review_add_button}
              onClick={handleMoveReviewAdd}
            >
              리뷰 작성
            </p>
          </div>

          {reviews.length > 0 ? (
            <div className={style.reviewList}>
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p>등록된 리뷰가 없습니다.</p>
          )}
        </div>

        {/* 태그 */}
        <div className={style.tagSection}>
          <h3>작품 키워드</h3>
          <div className={style.tagList}>
            {product?.tagStrList.map((tag, index) => (
              <span key={index} className={style.tag}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 오른쪽 섹션 */}
      <section className={style.rightSection}>
        <div className={style.shopInfo} onClick={handleMoveShop}>
          <div className={style.sellerInfo}>
            <ImageLoader
              imagePath={product?.shopImage}
              alt="샵 이미지"
              className={style.shop_img}
            />
            <p>{product?.shopName} Shop</p>
          </div>
          <ReviewRating rating={product?.reviewAverage} />
        </div>

        {/* 좋아요 */}
        <div className={style.title_container}>
          <h2 className={style.productName}>{product?.name}</h2>
          <LikeButton
            initialLikeState={product?.likes}
            itemId={productId}
            isShop={false}
            className={style.heart_img}
            unlikedIcon="/heart.png"
            likedIcon="/fillHeart.png"
          />
        </div>

        {/* 할인 정보 */}
        <div className={style.priceSection}>
          <div className={style.discountBox}>
            {isDiscounted && (
              <span className={style.discountRate}>
                {product?.discountRate}%
              </span>
            )}
            {isDiscounted && (
              <p className={style.originalPrice}>
                {product?.price.toLocaleString()}원
              </p>
            )}
          </div>
          <p className={style.discountPrice}>
            {product?.discountPrice.toLocaleString()}원
          </p>
        </div>

        {/* 수량 선택 */}
        <div className={style.quantitySelector}>
          <p>수량</p>
          <div className={style.quantity_button_container}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              -
            </button>
            <span className={style.total_quantity}>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>

        {/* 총 결제 금액 */}
        <div className={style.totalPrice}>
          총 결제금액: <strong>{totalPrice}원</strong>
        </div>

        {/* 버튼 */}
        <div className={style.buttonContainer}>
          <button className={style.cartButton} onClick={handleAddToCart}>
            장바구니
          </button>
          <button className={style.buyButton} onClick={handleAddToPayment}>
            구매하기
          </button>
        </div>
      </section>
      <MessageButton
        shopId={product?.shopId}
        shopImage={product?.shopImage}
        shopName={product?.shopName}
      />
    </div>
  );
}

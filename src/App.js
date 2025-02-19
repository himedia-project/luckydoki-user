import { Route, Routes } from "react-router-dom";
import "./App.css";
import KakaoRedirectPage from "./components/auth/KakaoRedirectPage";
import MainLayout from "./layouts/MainLayout";
import MyPageLayout from "./layouts/MyPageLayout";
import CommunityAddPage from "./pages/addpage/CommunityAddPage";
import ProductAddPage from "./pages/addpage/ProductAddPage";
import ReviewAddPage from "./pages/addpage/ReviewAddPage";
import SellerAddPage from "./pages/addpage/SellerAddPage";
import CartPage from "./pages/CartPage";
import CommunityDetailPage from "./pages/community/CommunityDetailPage";
import CommunityPage from "./pages/community/CommunityPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CouponPage from "./pages/mypage/CouponPage";
import LikesListPage from "./pages/mypage/LikesListPage";
import MyPage from "./pages/mypage/MyPage";
import MyReviewPage from "./pages/mypage/MyReviewPage";
import NotificationPage from "./pages/mypage/NotificationPage";
import OrderPage from "./pages/mypage/OrderPage";
import UserInfoPage from "./pages/mypage/UserInfoPage";
import NotFoundPage from "./pages/NotFoundPage";
import PaymentFailPage from "./pages/payment/PaymentFailPage";
import PaymentPage from "./pages/payment/PaymentPage";
import PaymentSuccessPage from "./pages/payment/PaymentSuccessPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import CategoryLayout from "./layouts/CategoryLayout";
import CategoryListPage from "./pages/CategoryListPage";
import PopularPage from "./pages/product/PopularPage";
import NewPage from "./pages/product/NewPage";
import ShopPage from "./pages/ShopPage";
import MessagePage from "./pages/MessagePage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/shop/:shopId" element={<ShopPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/:id" element={<CommunityDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/fail" element={<PaymentFailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />

        <Route path="/review_add" element={<ReviewAddPage />} />
        <Route path="/product_add" element={<ProductAddPage />} />
        <Route path="/community_add" element={<CommunityAddPage />} />
        <Route path="/seller_add" element={<SellerAddPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/member/kakao" element={<KakaoRedirectPage />} />
      <Route path="/join" element={<RegisterPage />} />

      <Route element={<MyPageLayout />}>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/my_review" element={<MyReviewPage />} />
        <Route path="/likeslist" element={<LikesListPage />} />
        <Route path="/coupon" element={<CouponPage />} />
        <Route path="/userinfo" element={<UserInfoPage />} />
      </Route>
      <Route path="/category/:categoryId" element={<CategoryLayout />}>
        <Route index element={<CategoryListPage />} />
      </Route>
      <Route path="/popular" element={<PopularPage />} />
      <Route path="/new" element={<NewPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

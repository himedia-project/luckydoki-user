import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import MainLayout from "./layouts/MainLayout";
import KakaoRedirectPage from "./components/auth/KakaoRedirectPage";
import MyPageLayout from "./layouts/MyPageLayout";
import MyPage from "./pages/mypage/MyPage";
import OrderPage from "./pages/mypage/OrderPage";
import NoticePage from "./pages/mypage/NoticePage";
import MyReviewPage from "./pages/mypage/MyReviewPage";
import WishListPage from "./pages/mypage/WishListPage";
import CouponPage from "./pages/mypage/CouponPage";
import UserInfoPage from "./pages/mypage/UserInfoPage";
import ReviewAddPage from "./pages/addpage/ReviewAddPage";
import ProductAddPage from "./pages/addpage/ProductAddPage";
import CommunityAddPage from "./pages/addpage/CommunityAddPage";
import SellerAddPage from "./pages/addpage/SellerAddPage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/message" />
        <Route path="/shop" />
        <Route path="/community" />

        <Route path="/review_add" element={<ReviewAddPage />} />
        <Route path="/product_add" element={<ProductAddPage />} />
        <Route path="/community_add" element={<CommunityAddPage />} />
        <Route path="/seller_add" element={<SellerAddPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/member/kakao" element={<KakaoRedirectPage />} />

      <Route element={<MyPageLayout />}>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/my_review" element={<MyReviewPage />} />
        <Route path="/wishlist" element={<WishListPage />} />
        <Route path="/coupon" element={<CouponPage />} />
        <Route path="/userinfo" element={<UserInfoPage />} />
      </Route>
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

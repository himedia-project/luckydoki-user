import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import MainLayout from "./layouts/MainLayout";
import KakaoRedirectPage from "./components/auth/KakaoRedirectPage";
import MyPageLayout from "./layouts/MyPageLayout";
import MyPage from "./pages/MyPage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/member/kakao" element={<KakaoRedirectPage />} />
      <Route element={<MyPageLayout />}>
        <Route path="/mypage" element={<MyPage />} />
      </Route>
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

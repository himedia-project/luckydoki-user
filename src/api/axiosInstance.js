import axios from "axios";
import store from "./redux/store";
import { login, logout } from "./redux/loginSlice";
import { API_URL } from "../config/apiConfig";
import Swal from "sweetalert2";
import { clearCartItems, setCartEmail } from "./redux/cartSlice";
import {
  clearNotificationItems,
  setNotificationEmail,
} from "./redux/notificationSlice";
import { setMessageEmail } from "./redux/messageSlice";
import { clearInfo } from "./redux/infoSlice";
import { logoutPost } from "./loginApi";

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  // 쿠키 허용
  withCredentials: true,
});

const refreshJWT = async () => {
  const res = await axiosInstance.get(`/member/refresh`);

  console.log("----------------------");
  console.log(res.data);

  return res.data;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().loginSlice.accessToken;
    console.log("axiosInstance.interceptors.request.use. token", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // const navigate = useNavigate();
    console.log("interceptor error: ", error);
    if (
      error.response.data &&
      error.response.data.error === "ERROR_ACCESS_TOKEN" // TODO: 토큰 만료 시에만! 토큰 갱신
    ) {
      try {
        const result = await refreshJWT();
        console.log("refreshJWT RESULT", result);

        // 로그인 성공 시 Redux store 업데이트
        // 로그인 성공 시 Redux store 업데이트
        // interceptor에서는 직접 store.dispatch를 사용해야
        // useDispatch(
        store.dispatch(
          login({
            email: result.email,
            roles: result.roles,
            accessToken: result.accessToken,
          })
        );

        return axiosInstance(error.config); // 재요청
      } catch (refreshError) {
        // 리프레시 토큰이 만료되었거나 찾을 수 없는 경우
        if (refreshError.response?.data?.error === "REFRESH_TOKEN_NOT_FOUND") {
          // 로그아웃 처리
          store.dispatch(logout());
          store.dispatch(setCartEmail(""));
          store.dispatch(setNotificationEmail(""));
          store.dispatch(setMessageEmail(""));
          store.dispatch(clearCartItems());
          store.dispatch(clearNotificationItems());
          store.dispatch(clearInfo());

          const response = logoutPost();
          console.log("logoutPost response: ", response);

          // 알림창 표시
          await Swal.fire({
            title: "세션이 만료되었습니다.",
            text: "다시 로그인해주세요.",
            icon: "warning",
            confirmButtonText: "확인",
            confirmButtonColor: "#00de90",
          });

          // 로그인 페이지로 리다이렉션
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

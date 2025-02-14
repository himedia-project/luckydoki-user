import axios from "axios";
import store from "./redux/store";
import { setAccessToken } from "./redux/loginSlice";
import { API_URL } from "../config/apiConfig";
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
      error.response.data.error === "ERROR_ACCESS_TOKEN"
    ) {
      const result = await refreshJWT();
      console.log("refreshJWT RESULT", result);

      const accessToken = result.newAccessToken;

      store.dispatch(setAccessToken(accessToken));

      return axiosInstance(error.config); // 재요청
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

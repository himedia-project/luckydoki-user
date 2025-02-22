import axiosInstance from "./axiosInstance";
import axios from "axios";

const host = process.env.REACT_APP_API_URL;

// // 로그인
export const loginPost = async (email, password) => {
  const response = await axios.post(
    `${host}/api/member/login`,
    { email, password },
    {
      withCredentials: true,
    }
  );
  return response;
};

// 로그아웃
export const logoutPost = async () => {
  const response = await axiosInstance.post("/member/logout");
  return response.data;
};

export const quitMember = async () => {
  const response = await axiosInstance.delete("/member");
  return response;
};

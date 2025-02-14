import axios from "axios";
import axiosInstance from "./axiosInstance";

// // 로그인
// export const loginPost = async (email, password) => {
//   const response = await axios.post(
//     `${host}/login`,
//     { email, password },
//     {
//       withCredentials: true,
//     }
//   );
//   console.log(response.data);
//   return response.data;
// };

// 로그아웃
export const logoutPost = async () => {
  const response = await axiosInstance.post("/member/logout");
  return response.data;
};

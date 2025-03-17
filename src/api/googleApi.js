import axios from "axios";

import { API_URL, FRONT_USER_HOST } from "../config/apiConfig";

const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const client_secret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;

// 리다이렉트 uri => googleRedirectPage로 이동
const redirect_uri = `${FRONT_USER_HOST}/member/google`;

// 인증 code 요청 url
const auth_code_path = `https://accounts.google.com/o/oauth2/v2/auth`;

// access token 요청 url
const access_token_url = `https://oauth2.googleapis.com/token`;

// 환경변수에서 값을 제대로 가져오는지 디버깅을 위해 로깅
console.log("client_id:", client_id);
console.log("FRONT HOST:", FRONT_USER_HOST);
console.log("REDIRECT URI:", redirect_uri);

// 구글 로그인 요청 -> 구글 로그인 페이지(리다이렉트 페이지)로 이동
export const getGoogleLoginLink = () => {
  const googleURL = new URL(auth_code_path);
  googleURL.searchParams.append("client_id", client_id);
  googleURL.searchParams.append("redirect_uri", redirect_uri);
  googleURL.searchParams.append("response_type", "code");
  googleURL.searchParams.append("scope", "email profile");
  googleURL.searchParams.append("access_type", "offline");
  googleURL.searchParams.append("prompt", "consent");

  console.log("getGoogleLoginLink googleURL: ", googleURL.toString());
  return googleURL.toString();
};

// 구글 로그인 후 code를 받고, 서버가 대신 google oauth2서버에 access_token 요청, 받아옴
export const getAccessToken = async (authCode) => {
  const header = {
    withCredentials: true,
  };
  const res = await axios.get(
    `${API_URL}/api/member/google/token?code=${authCode}`,
    header
  );
  console.log("getAccessToken res: ", res);
  return res.data;
};

// accessToken을 받고 구글 사용자 정보 서버에 요청
export const getMemberWithAccessToken = async (accessToken) => {
  const header = {
    withCredentials: true,
  };
  const res = await axios.get(
    `${API_URL}/api/member/google?accessToken=${accessToken}`,
    header
  );
  return res.data;
};

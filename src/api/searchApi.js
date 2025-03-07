import axiosInstance from "./axiosInstance";
import axios from "axios";

import { AI_API_SERVER_URL } from "../config/apiConfig";

// 상품 검색 결과 리스트
export const searchProduct = async (searchKeyword) => {
  return await axiosInstance.get("/product/list", {
    params: { searchKeyword: searchKeyword },
  });
};

// 커뮤니티 검색 결과 리스트트
export const searchCommunity = async (searchKeyword) => {
  const params = {};
  if (searchKeyword) {
    params.searchKeyword = searchKeyword;
  }
  return await axiosInstance.get("/community/list", { params });
};

// 커뮤니티 검색 결과 리스트트
export const communityPage = async (searchKeyword, page = 1, size = 10) => {
  const params = {
    page,
    size,
  };
  if (searchKeyword) {
    params.searchKeyword = searchKeyword;
  }
  return await axiosInstance.get("/community/list/page", { params });
};

// 이미지 분석 결과 문자열 리스트
// http://localhost:8081/api/ai/image/analyze
// form-data 형식으로 이미지 파일 전송
// image
export const analyzeImage = async (image) => {
  const formData = new FormData();
  formData.append("image", image);
  return await axios.post(
    `${AI_API_SERVER_URL}/api/ai/image/analyze`,
    formData
  );
};

// 인기 검색어 가져오기
export const getPopularKeywords = async (limit = 5) => {
  return await axiosInstance.get("/search/popular-keywords", {
    params: { limit },
  });
};

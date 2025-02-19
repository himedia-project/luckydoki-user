import axios from "axios";
import { API_URL } from "../config/apiConfig";
import axiosInstance from "../api/axiosInstance";

// 상품 리스트(searchPage에도 사용)
export const getProductList = async (searchKeyword = "") => {
  return await axios.get(`${API_URL}/api/product/list`, {
    params: { searchKeyword },
    withCredentials: true,
  });
};

// 상품 정보 가져오기(detail)
export const getProductInfo = async (productId) => {
  return await axios.get(`${API_URL}/api/product/${productId}/detail`);
};

// 상품 장바구니에 담기
export const postProduct = async (formData) => {
  return await axiosInstance.post(`/cart`, formData);
};

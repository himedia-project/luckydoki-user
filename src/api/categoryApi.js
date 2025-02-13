import axiosInstance from "./axiosInstance";

// 메인 카테고리 목록 조회
export const getMainCategories = () => {
  return axiosInstance.get("/api/category");
};

// 서브 카테고리 목록 조회
export const getSubCategories = (mainCategoryId) => {
  return axiosInstance.get(`/api/category/${mainCategoryId}/sub/list`);
};

// 자식 카테고리 목록 조회
export const getChildCategories = (subCategoryId) => {
  return axiosInstance.get(`/api/category/${subCategoryId}/child/list`);
};

// 카테고리별 상품 목록 조회
export const getProductsByCategoryId = (categoryId) => {
  return axiosInstance.get(`/api/category/${categoryId}/product/list`);
};

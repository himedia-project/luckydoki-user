import axiosInstance from "./axiosInstance";

// 메인 카테고리 목록 조회
export const getMainCategories = async () => {
  return await axiosInstance.get("/category");
};

// 서브 카테고리 목록 조회
export const getSubCategories = async (mainCategoryId) => {
  return await axiosInstance.get(`/category/${mainCategoryId}/sub/list`);
};

// 자식 카테고리 목록 조회
export const getChildCategories = async (subCategoryId) => {
  return await axiosInstance.get(`/category/${subCategoryId}/child/list`);
};

// 카테고리별 상품 목록 조회
export const getProductsByCategoryId = async (categoryId) => {
  return await axiosInstance.get(`/category/${categoryId}/product/list`);
};

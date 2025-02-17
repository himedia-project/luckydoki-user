import axiosInstance from "./axiosInstance";

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

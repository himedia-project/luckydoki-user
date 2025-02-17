import axiosInstance from "./axiosInstance";

// 상품 검색 결과 리스트
export const searchProduct = async (searchKeyword) => {
  return await axiosInstance.get("/product/list", {
    params: { searchKeyword: searchKeyword },
  });
};

export const searchCommunity = async (searchKeyword) => {
  return await axiosInstance.get("/community/list", {
    params: { searchKeyword: searchKeyword },
  });
};

import axiosInstance from "../api/axiosInstance";

// 상품 리스트(searchPage에도 사용)
export const getProductList = async (
  searchKeyword = "",
  tagIdList = "",
  excludeIdList = ""
) => {
  return await axiosInstance.get(`/product/list`, {
    params: { searchKeyword, tagIdList, excludeIdList },
    withCredentials: true,
  });
};

// 상품 정보 가져오기(detail)
export const getProductInfo = async (productId) => {
  return await axiosInstance.get(`/product/${productId}/detail`);
};

// 상품 장바구니에 담기
export const postProduct = async (formData) => {
  return await axiosInstance.post(`/cart`, formData);
};

// 상품 validate 수량
// GET http://localhost:8080/api/product/{{id}}/validate/count?
//     count={{$random.integer(100)}}
export const validateCount = async (productId, count) => {
  return await axiosInstance.get(`/product/${productId}/validate/count`, {
    params: { count },
  });
};

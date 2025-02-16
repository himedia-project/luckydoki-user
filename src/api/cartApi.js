import axiosInstance from "./axiosInstance";

// 해당 유저의 장바구니 조회
// http://localhost:8080/api/cart/item/list
export const getCartItemList = async () => {
  const response = await axiosInstance.get("/cart/item/list");
  return response.data;
};

// 장바구니 상품 추가
// http://localhost:8080/api/cart
export const addCartItem = async (productId, qty) => {
  const response = await axiosInstance.post("/cart/item", { productId, qty });
  return response.data;
};

// 장바구니 상품 수량 변경
// http://localhost:8080/api/cart/item/{cartItemId}/qty
export const changeCartItemQty = async (cartItemId, qty) => {
  const response = await axiosInstance.post(`/cart/item/${cartItemId}/qty`, {
    qty,
  });
  return response.data;
};

// 장바구니 상품 삭제
// http://localhost:8080/api/cart/1
export const deleteCartItem = async (cartItemId) => {
  const response = await axiosInstance.delete(`/cart/item/${cartItemId}`);
  return response.data;
};

// 장바구니 상품 선택삭제
// http://localhost:8080/api/cart/list
// {
//     "cartItemIdList": [6,7,8]
// }
export const deleteAllCartItems = async (cartItemIdList) => {
  const response = await axiosInstance.delete("/cart/item/list", {
    data: { cartItemIdList },
  });
  return response.data;
};

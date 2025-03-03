import { createSlice } from "@reduxjs/toolkit";

const initState = {
  email: "",
  cartItems: [],
  totalPrice: 0,
  totalDiscountPrice: 0,
};

const cartSlice = createSlice({
  name: "cartSlice",
  initialState: initState,
  reducers: {
    setCartEmail: (state, action) => {
      state.email = action.payload;
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      state.totalPrice = action.payload.reduce(
        (sum, item) => sum + item.price,
        0
      );
      state.totalDiscountPrice = action.payload.reduce(
        (sum, item) => sum + item.discountPrice,
        0
      );
    },
    addCartItems: (state, action) => {
      state.cartItems.push(action.payload);
      state.totalPrice = action.payload.reduce(
        (sum, item) => sum + item.price,
        0
      );
      state.totalDiscountPrice = action.payload.reduce(
        (sum, item) => sum + item.discountPrice,
        0
      );
    },
    clearCartItems: (state) => {
      return { ...initState };
    },
  },
});

export const { setCartItems, addCartItems, clearCartItems, setCartEmail } =
  cartSlice.actions;
export default cartSlice.reducer;

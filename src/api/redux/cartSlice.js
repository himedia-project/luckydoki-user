import { createSlice } from '@reduxjs/toolkit';

const initState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cartSlice',
  initialState: initState,
  reducers: {
    setCartItems: (state, action) => {
      console.log('setCartItems: {}', action.payload);
      const payload = action.payload; // cartItems로 구성
      return { ...payload };
    },
    clearCartItems: (state) => {
      return { ...initState };
    },
  },
});

export const { setCartItems, clearCartItems, addCartItem } = cartSlice.actions;
export default cartSlice.reducer;

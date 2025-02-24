import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shopId: "",
};

const infoSlice = createSlice({
  name: "infoSlice",
  initialState,
  reducers: {
    setShopId: (state, action) => {
      state.shopId = action.payload;
    },
    clearInfo: (state) => {
      return { ...initialState };
    },
  },
});

export const { setShopId, clearInfo } = infoSlice.actions;
export default infoSlice.reducer;

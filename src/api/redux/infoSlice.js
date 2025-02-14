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
  },
});

export const { setShopId } = infoSlice.actions;
export default infoSlice.reducer;

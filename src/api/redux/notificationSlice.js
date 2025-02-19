import { createSlice } from "@reduxjs/toolkit";

const initState = {
  notificationItems: [],
};

const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState: initState,
  reducers: {
    setNotificationItems: (state, action) => {
      if (typeof action.payload === "function") {
        state.notificationItems = action.payload(state.notificationItems);
      } else {
        state.notificationItems = action.payload;
      }
    },
    clearNotificationItems: (state) => {
      state.notificationItems = [];
    },
  },
});

export const { setNotificationItems, clearNotificationItems } =
  notificationSlice.actions;
export default notificationSlice.reducer;

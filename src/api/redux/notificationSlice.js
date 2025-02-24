import { createSlice } from "@reduxjs/toolkit";

const initState = {
  email: "",
  notificationItems: [],
};

const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState: initState,
  reducers: {
    setNotificationEmail: (state, action) => {
      state.email = action.payload;
    },
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

export const {
  setNotificationItems,
  clearNotificationItems,
  setNotificationEmail,
} = notificationSlice.actions;
export default notificationSlice.reducer;

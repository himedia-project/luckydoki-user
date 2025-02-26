import { createSlice } from "@reduxjs/toolkit";

const initState = {
  email: "",
  notificationItems: [],
};

const messageSlice = createSlice({
  name: "messageSlice",
  initialState: initState,
  reducers: {
    setMessageEmail: (state, action) => {
      state.email = action.payload;
    },
    setMessageItems: (state, action) => {
      if (typeof action.payload === "function") {
        state.messageItems = action.payload(state.messageItems);
      } else {
        state.notificationItems = action.payload;
      }
    },
    clearMessageItems: (state) => {
      state.messageItems = [];
    },
  },
});

export const { setMessageItems, clearMessageItems, setMessageEmail } =
  messageSlice.actions;
export default messageSlice.reducer;

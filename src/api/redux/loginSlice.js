import { createSlice } from "@reduxjs/toolkit";

const initState = {
  email: "",
  roles: [],
  accessToken: "",
};

const loginSlice = createSlice({
  name: "loginSlice",
  initialState: {
    email: "",
    roles: [],
    accessToken: "",
  },
  reducers: {
    login: (state, action) => {
      const payload = action.payload;
      return { ...payload };
    },
    logout: (state) => {
      return { ...initState };
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
  },
});

export const { login, logout, setAccessToken, setRoles } = loginSlice.actions;
export default loginSlice.reducer;

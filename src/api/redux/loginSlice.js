import { createSlice } from "@reduxjs/toolkit";

const initState = {
  email: "",
  roles: [],
  accessToken: "",
};

const loginSlice = createSlice({
  name: "loginSlice",
  initialState: initState,
  reducers: {
    login: (state, action) => {
      console.log("login: {}", action.payload);
      const payload = action.payload; // email, roles, accessToken으로 구성
      return { ...payload };
    },
    logout: (state) => {
      // email 삭제
      // accessToken 삭제
      return { ...initState };
    },
    setAccessToken: (state, action) => {
      console.log("setAccessToken: accessToken", action.payload);
      state.accessToken = action.payload;
    },
    setRoles: (state, action) => {
      // TODO: seller 관리자 승인시, 알림 줄때 사용
      console.log("setRoles: roles", action.payload);
      state.roles = action.payload;
    },
  },
});

export const { login, logout, setAccessToken, setRoles } = loginSlice.actions;
export default loginSlice.reducer;

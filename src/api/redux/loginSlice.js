import { createSlice } from '@reduxjs/toolkit';

const initState = {
  email: '',
  roles: [],
  accessToken: '',
};

const loginSlice = createSlice({
  name: 'loginSlice',
  initialState: initState,
  reducers: {
    login: (state, action) => {
      console.log('login: {}', action.payload);
      const payload = action.payload; // email, roles, accessToken으로 구성
      return { ...payload };
    },
    logout: (state) => {
      // email 삭제
      // accessToken 삭제
      return { ...initState };
    },
    setAccessToken: (state, action) => {
      console.log('setAccessToken: accessToken', action.payload);
      state.accessToken = action.payload;
    },
  },
});

export const { login, logout, setAccessToken } = loginSlice.actions;
export default loginSlice.reducer;

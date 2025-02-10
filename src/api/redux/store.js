import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './loginSlice';

export const store = configureStore({
  // 여러 리듀서들을 하나로 결합
  reducer: {
    loginSlice: loginSlice, // 로그인 상태 관리
  },
});

export default store;

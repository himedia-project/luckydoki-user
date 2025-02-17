import { combineReducers, configureStore } from "@reduxjs/toolkit";
import loginSlice from "./loginSlice";
import infoSlice from "./infoSlice";
import cartSlice from "./cartSlice";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({
  loginSlice,
  infoSlice,
  cartSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // redux-persist 관련 직렬화 에러 방지를 위해 serializableCheck 옵션을 비활성화할 수 있습니다.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export default store;

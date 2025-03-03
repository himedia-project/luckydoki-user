import { combineReducers, configureStore } from "@reduxjs/toolkit";
import loginSlice from "./loginSlice";
import infoSlice from "./infoSlice";
import cartSlice from "./cartSlice";
import categorySlice from "./categorySlice"; // ✅ 카테고리 슬라이스 추가
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import notificationSlice from "./notificationSlice";
import messageSlice from "./messageSlice";
const rootReducer = combineReducers({
  loginSlice,
  infoSlice,
  cartSlice,
  category: categorySlice,
  notificationSlice,
  messageSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["loginSlice", "cartSlice", "notificationSlice"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export default store;

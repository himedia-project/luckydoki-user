import { combineReducers } from "redux";
import cartSlice from "./cartSlice";
import loginSlice from "./loginSlice";
import infoSlice from "./infoSlice";
import notificationSlice from "./notificationSlice";
import messageSlice from "./messageSlice";
// 다른 slice들도 import

const rootReducer = combineReducers({
  cartSlice,
  // loginSlice,
  infoSlice,
  notificationSlice,
  messageSlice,
});

export default rootReducer;

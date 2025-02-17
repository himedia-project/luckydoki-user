import { combineReducers } from "redux";
import cartSlice from "./cartSlice";
import loginSlice from "./loginSlice";
import infoSlice from "./infoSlice";
// 다른 slice들도 import

const rootReducer = combineReducers({
  cartSlice,
  loginSlice,
  infoSlice,
});

export default rootReducer;

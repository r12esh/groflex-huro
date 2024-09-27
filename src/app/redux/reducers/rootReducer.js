import { combineReducers } from "redux";
import { themeReducer } from "./themeReducer";
import { accountDataReducer } from "./accountDataReducer";

const rootReducer = combineReducers({
  themeData: themeReducer,
  accountData: accountDataReducer,
});

export default rootReducer;

import { legacy_createStore } from "redux";
import rootReducer from "./reducers/rootReducer";

const store = legacy_createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;

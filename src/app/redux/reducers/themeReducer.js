import * as types from "../actions/actions.types";

const initialState = {
  theme: "light",
  sidebarIsActive: false,
};

export function themeReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_THEME_LIGHT:
      return {
        ...state,
        theme: "light",
      };
    case types.SET_THEME_DARK:
      return {
        ...state,
        theme: "dark",
      };
    case types.SET_SIDEBAR_PANEL_ACTIVE:
      return {
        ...state,
        sidebarIsActive: true,
      };
    case types.SET_SIDEBAR_PANEL_INACTIVE:
      return {
        ...state,
        sidebarIsActive: false,
      };
    default:
      return state;
  }
}

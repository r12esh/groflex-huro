import * as actionTypes from "../actions/actions.types";

const initialState = {
  tenantData: undefined,
  userData: undefined,
  accountInfoData: undefined,
  subscriptionData: undefined,
  hasNewSubscriptionModalOpened: false,
};

export function accountDataReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_TENANT_DATA:
      return { ...state, tenantData: action.payload };
    case actionTypes.SET_USER_DATA:
      return { ...state, userData: action.payload };
    case actionTypes.SET_ACCOUNTINFO_DATA:
      return { ...state, accountInfoData: action.payload };
    case actionTypes.SET_SUBSCRIPTION_DATA:
      return { ...state, subscriptionData: action.payload };
    case actionTypes.SET_HAS_NEW_SUBSCRIPTION_MODAL_OPENED:
      return { ...state, hasNewSubscriptionModalOpened: action.payload };
    default:
      return state;
  }
}

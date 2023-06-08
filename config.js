import webStorageKeyEnum from "./src/app/enums/web-storage-key.enum";
import WebStorageService from "./src/app/services/webstorage.service";

const apiServers = {
  // local: "http://localhost:3000",
  local: "https://dev.groflex.in",
  development: "https://dev.groflex.in",
  qa: "https://qa.groflex.in",
  staging: "https://staging.groflex.in",
  production: "https://app.groflex.in",
  // integration: "https://web-integration-invoiz.buhl.de",
  // admin: "https://invoiz-admin.buhl.de",
};
const loginExpireHours = 24;
const baseUrl = apiServers.local;

const setResourceHost = () => {
  return `${baseUrl}/api/`;
};
const resourceHost = setResourceHost();
const login = `${resourceHost}session/create?type=bearer`;
const contact = `${resourceHost}customer`

const checkLoginTokenIsValid = () => {
  const loginToken = WebStorageService.getItem(
    webStorageKeyEnum.LOGIN_TOKEN_KEY
  );
  const loginTokenStartTime = WebStorageService.getItem(
    webStorageKeyEnum.LOGIN_TOKEN_START_TIME
  );

  if (loginTokenStartTime && loginToken) {
    const difference = Math.abs(
      new Date().getTime() - parseInt(loginTokenStartTime)
    );
    const hours = Math.ceil(Math.abs(difference / 36e5));
    if (hours <= loginExpireHours) {
      return true;
    }
  }
  // localStorage.clear();
  WebStorageService.removeItem(webStorageKeyEnum.LOGIN_TOKEN_KEY);
  WebStorageService.removeItem(webStorageKeyEnum.LOGIN_TOKEN_START_TIME);
  return false;
};

const config = {
  resourceHost,
  login,
  checkLoginTokenIsValid,
  contact
};

export default config;

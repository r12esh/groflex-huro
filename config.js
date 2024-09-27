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
const loginExpireHours = 6;
const baseUrl = apiServers.local;

const setResourceHost = () => {
  return `${baseUrl}/api/`;
};
const setAssetResourceHost = () => {
  return `${baseUrl}/api`;
};

const resourceHost = setResourceHost();
const imageResourceHost = setAssetResourceHost();
const assetResourceHost = setAssetResourceHost();

const resourceUrls = {
  //1st Registration token
  getRegistartionToken: `${resourceHost}user/email`, // POST | body: {email: "ritesh098765432+15dev@gmail"} | Gives the registration token
  /*All verification APIs will need Registration token */
  //Email verification and 2nd Registeration token, this can also be used as Login token
  sendEmailOtp: `${resourceHost}user/password`, //  POST | body: {password: "rguptagrofleX1@", email: "ritesh098765432+15dev@gmail.com"} | Gives verifystep = "code"
  resendEmailOtp: `${resourceHost}user/email/resend_code`, // Dont know the method :( | no payload | no body res
  verifyEmailOtp: `${resourceHost}user/email/code`, // POST | body: {code: "1234"} | no body res :(
  //Mobile verification
  sendMobileOtp: `${resourceHost}tenant/set_mobile`, // PUT | body: {mobileNo : "9876543210"} | gives no body response
  verifyMobileOtp: `${resourceHost}tenant/verify_mobile_otp`, // PUT | body : {mobileOtp : "123456"} | success : true
  //Login
  login: `${resourceHost}session/create?type=bearer`,
  checkEmailExist: `${resourceHost}user/checkUser`,
  /* ALl in-app APIs will need Login token */
  //Articles
  articleNumber: `${resourceHost}article/number`, //Get Create article's number
  postArticleImage: `${resourceHost}article/image/`, //Concatenate articleId
  articles: `${resourceHost}article?offset=0&searchText=&limit=9999999&orderBy=number&desc=false`,
  article: `${resourceHost}article/`, // concatenate article Id
  articleHistory: (articleId) =>
    `${resourceHost}article/${articleId}/history?offset=0&limit=5&orderBy=date&desc=true&filter=all`, // pass article Id

  articleSearch: `${resourceHost}find/eanRecord/`, // concatenate search query
  //Customers
  customers: `${resourceHost}customer?offset=0&searchText=&limit=9999999&orderBy=number&desc=false`,
  tenant: `${resourceHost}tenant`,
  accountSettings: `${resourceHost}setting/account`,
  changeProfileName: `${resourceHost}user/changePassword`,
  user: `${resourceHost}setting/user`,
  contact: `${resourceHost}customer`,
  miscellaneous: `${resourceHost}setting/miscellaneous`,

  //Invoices
  invoices: `${resourceHost}invoice?offset=0&searchText=&limit=9999999&orderBy=date&desc=true&filter=all&trigger=true`,
  invoice: `${resourceHost}invoice/`, // Contatenate invoiceId

  //Quotation
  quotations: `${resourceHost}offer?offset=0&searchText=&limit=9999999&orderBy=date&desc=true&filter=all&trigger=true`,
  quotation: `${resourceHost}offer/`, //Concatenate QuotationId

  //Recurring
  recurring: `${resourceHost}recurringinvoice?offset=0&searchText=&limit=9999999&orderBy=name&desc=true`,

  //Accounting
  //Transaction
  transaction: `${resourceHost}bankTransaction?offset=0&searchText=&limit=9999999&orderBy=date&desc=true`,
  bank: `${resourceHost}bank`,
};

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
    const hours = parseFloat(Math.abs(difference / 36e5).toFixed(2));
    console.log("Hours after login: ", hours);
    if (hours <= loginExpireHours) {
      return true;
    }
  }
  // localStorage.clear();
  WebStorageService.removeItem(webStorageKeyEnum.LOGIN_TOKEN_KEY);
  WebStorageService.removeItem(webStorageKeyEnum.LOGIN_TOKEN_START_TIME);
  return false;
};

const regex = {
  emailCheck:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
};

const modules = {
  sales: {
    name: "sales",
    heading: "Sales",
    links: [
      { label: "Invoices", route: "/sales/invoices" },
      { label: "Quotations", route: "/sales/quotations" },
      { label: "Recurring invoices", route: "/sales/recurring-invoices" },
      { label: "Timesheets", route: "/sales/time-sheets" },
    ],
  },
  accounting: {
    name: "accounting",
    heading: "Accounting",
    links: [
      { label: "Transactions", route: "/accounting/transactions" },
      { label: "Cash and Bank", route: "/accounting/cash-and-bank" },
      { label: "Debit Notes", route: "/accounting/debit-notes" },
    ],
  },
  inventory: {
    name: "inventory",
    heading: "Inventory",
    links: [
      { label: "Dashboard", route: "/inventory/dashboard" },
      { label: "Purchase Order", route: "/inventory/purchase-orders" },
      { label: "Sales Order", route: "/inventory/sales-orders" },
      {
        label: "Reporting & Analytics",
        route: "/inventory/reporting-and-analytics",
      },
    ],
  },
  crm: {
    name: "crm",
    heading: "CRM",
    links: [
      { label: "Leads", route: "/crm/leads" },
      { label: "Contact Management", route: "/crm/contact-management" },

      { label: "Tasks Overview", route: "/crm/tasks-overview" },
      { label: "Deals Overview", route: "/crm/deals-overview" },
      { label: "Task details", route: "/crm/task-details" },
    ],
  },
};

const getCurrentModule = () => {
  const locationPath = window.location.pathname;
  // console.log(locationPath);
  const firstDepth = locationPath.split("/")[1];
  // console.log(firstDepth);
  switch (firstDepth) {
    case "sales":
      return modules.sales;
    case "accounting":
      return modules.accounting;
    case "inventory":
      return modules.inventory;
    case "crm":
      return modules.crm;
    default:
      break;
  }
};
const dateFormat = {
  api: "YYYY-MM-DD",
  client: "DD-MM-YYYY",
};
const config = {
  resourceHost,
  imageResourceHost,
  assetResourceHost,
  resourceUrls,
  regex,
  checkLoginTokenIsValid,
  getCurrentModule,
  dateFormat,
};

export default config;

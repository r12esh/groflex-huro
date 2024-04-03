import _ from "lodash";
import lang from "./lang";
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
const loginExpireHours = 9;
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
  //Dashboard
  recievables: `${resourceHost}invoice`,
  payable: `${resourceHost}expense`,
  invoiceChartData: (startDate, endDate) =>
    `${resourceHost}invoice?startDate=${startDate}&endDate=${endDate}`,
  expenseChartData: (startDate, endDate) =>
    `${resourceHost}expense?startDate=${startDate}&endDate=${endDate}`,
  quotationChartData: (startDate, endDate) =>
    `${resourceHost}offer?startDate=${startDate}&endDate=${endDate}`,
  salesExpensesChartData: (starDate, endDate) =>
    `${resourceHost}dashboard/stats/turnoverExpenses?startDate=${starDate}&endDate=${endDate}`,
  salesByArticles: (startDate, endDate) =>
    `${resourceHost}dashboard/stats/turnoverCustomersArticles?startDate=${startDate}&endDate=${endDate}`,
  expenseBy: (startDate, endDate) =>
    `${resourceHost}dashboard/stats/expenseByArticle?startDate=${startDate}&endDate=${endDate}`,
  //Home
  quickLinks: `${resourceHost}quick-links`,
  lastViewedDocumentsAndCustomers: `${resourceHost}/dashboard/lastDocumentsAndCustomers`,
  //Articles
  articleNumber: `${resourceHost}article/number`, //Get Create article's number
  postArticleImage: `${resourceHost}article/image/`, //Concatenate articleId
  articles: (offset, limit) =>
    `${resourceHost}article?offset=${offset}&searchText=&limit=${limit}&orderBy=number&desc=false`,
  article: `${resourceHost}article/`, // concatenate article Id
  articleHistory: (articleId) =>
    `${resourceHost}article/${articleId}/history?offset=0&limit=5&orderBy=date&desc=true&filter=all`, // pass article Id

  articleSearch: `${resourceHost}find/eanRecord/`, // concatenate search query
  //Customers
  customers: (offset, limit) =>
    `${resourceHost}customer?offset=${offset}&searchText=&limit=${limit}&orderBy=number&desc=false`,
  tenant: `${resourceHost}tenant`,
  accountSettings: `${resourceHost}setting/account`,
  changeProfileName: `${resourceHost}user/changePassword`,
  user: `${resourceHost}setting/user`,
  contact: `${resourceHost}customer`,
  miscellaneous: `${resourceHost}setting/miscellaneous`,

  //Invoices
  invoices: (offset, limit, filter) =>
    `${resourceHost}invoice?offset=${offset}&searchText=&limit=${limit}&orderBy=date&desc=true&filter=${filter}&trigger=true`,
  invoice: `${resourceHost}invoice/`, // Contatenate invoiceId

  //Quotation
  quotations: (offset, limit, filter) =>
    `${resourceHost}offer?offset=${offset}&searchText=&limit=${limit}&orderBy=date&desc=true&filter=${filter}&trigger=true`,
  quotation: `${resourceHost}offer/`, //Concatenate QuotationId

  //Recurring
  recurring: (offset, limit, filter) =>
    `${resourceHost}recurringinvoice?offset=${offset}&searchText=&limit=${limit}&orderBy=name&desc=true&filter=${filter}`,

  //Accounting
  //Transaction
  transaction: (offset, limit) =>
    `${resourceHost}bankTransaction?offset=${offset}&searchText=&limit=${limit}&orderBy=date&desc=true`,
  bank: `${resourceHost}bank`,
  // Debit notes
  expenseCancellation: (offset, limit, filter) =>
    `${resourceHost}expenseCancellation?offset=${offset}&searchText=&limit=${limit}&orderBy=date&desc=true&filter=${filter}&trigger=true`,
  // Credit notes
  cancellation: (offset, limit, filter) =>
    `${resourceHost}cancellation?offset=${offset}&searchText=&limit=${limit}&orderBy=date&desc=true&filter=${filter}&trigger=true`,
  //Expenditure
  expenses: (offset, limit, filter) =>
    `${resourceHost}expense?offset=${offset}&searchText=&limit=${limit}&orderBy=date&desc=true&filter=${filter}`,
  expense: `${resourceHost}expense/`,
  // Chart of Accounts
  chartOfAccounts: (offset, limit) =>
    `${resourceHost}chartofaccount?offset=${offset}&searchText=&limit=${limit}&orderBy=accountName&desc=false`,
  chartOfAccount: `${resourceHost}chartofaccount/`,
  accountType: `${resourceHost}accountType?offset=0&searchText=&limit=9999999&orderBy=name&desc=false`,

  //Reports Balance Sheet
  balanceSheet: (startDate, endDate, fileType) =>
    `${resourceHost}accountingReport/balanceSheet/${startDate}/${endDate}?type=${fileType}`,
  reportsProfitAndLoss: (startDate, endDate, fileType) =>
    `${resourceHost}accountingReport/profitandloss/${startDate}/${endDate}?type=${fileType}`,
  generalLedger: (startDate, endDate, fileType, customerID) =>
    `${resourceHost}accountingReport/generalLedger/${startDate}/${endDate}?type=${fileType}&customerId=${customerID}`,
  generalLedgerCustomers: `${resourceHost}customer?offset=0`,
  cashFlow: (starDate, endDate, fileType) =>
    `${resourceHost}accountingReport/cashflow/${starDate}/${endDate}?type=${fileType}`,
  sendAccountingReport: (reportType, startDate, endDate) =>
    `${resourceHost}accountingReport/sendAccountingReportEmail/${reportType}/${startDate}/${endDate}`,
  gstReportExportSummary: (offset, limit) =>
    `${resourceHost}accountantExport/?offset=${offset}&limit=${limit}&orderBy=createdAt&desc=true`,
  getGstReport: `${resourceHost}accountantExport/`,
  getGstDetail: `${resourceHost}accountantExport/jsonDocument`,
  exportGstReport: `${resourceHost}accountantExport/`,
  //Delivery Challan
  deliveryChallanList: (offset, limit, filter) =>
    `${resourceHost}deliveryChallan?offset=${offset}&searchText=&limit=${limit}&orderBy=date&desc=true&filter=${filter}&trigger=true`,

  //InventoryDashboard
  lastOrder: `${resourceHost}/inventoryDashboard/lastPurchaseOrder?limit=6`,
  topAndLowSellingArticle: (startDate, endDate) =>
    `${resourceHost}/inventoryDashboard/topAndlowSellingArticle?orderBy=ASC&limit=10&year=true&month=false&week=false&lastMonth=false&secondLastMonth=false&startDate=${startDate}&endDate=${endDate}`,
  articleLowOnStock: (value) =>
    `${resourceHost}/inventoryDashboard/lowStockArticle?byCategory=${value}&limit=6`,
  profitAndLoss: `${resourceHost}/inventoryDashboard/profitAndLoss?year=true&month=false&week=false&lastMonth=false&secondLastMonth=false`,
  salesAndPurchase: `${resourceHost}/inventoryDashboard/saleAndPurchase?year=true&month=false&week=false&lastMonth=false&secondLastMonth=false`,
  //Stock Movement
  stockMovement1: `${resourceHost}inventory/history?offset=0&searchText=&limit=9999999&orderBy=itemModifiedDate&desc=false`,
  stockMovement2: `${resourceHost}inventory/?offset=0&searchText=&limit=9999999&orderBy=articleId&desc=false`,
  //Purchase Orders
  purchase: (offset, limit) =>
    `${resourceHost}purchaseOrder?offset=${offset}&searchText=&limit=${limit}&orderBy=date&desc=true&filter=all&trigger=true`,

  //Teams
  teamsList: (offset, limit) => `${resourceHost}user/list`,
  inviteNewUser: `${resourceHost}user/tenant`,
  inviteCa: `${resourceHost}user/cadetails`,
  updateUserRole: (userId) => `${resourceHost}user/${userId}/role`,
  deleteUser: `${resourceHost}tenant/user/`,
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
      { label: "Credit Notes", route: "/accounting/credit-notes" },
      { label: "Expenditure", route: "/accounting/expenses" },
      { label: "Reports", route: "/accounting/reports" },
      { label: "Chart of Accounts", route: "/accounting/chart-of-accounts" },
      { label: "Delivery Challan", route: "/accounting/delivery-challan" },
    ],
  },
  inventory: {
    name: "inventory",
    heading: "Inventory",
    links: [
      { label: "Dashboard", route: "/inventory/dashboard" },
      { label: "Purchase Order", route: "/inventory/purchase-orders" },
      { label: "Stock Movement", route: "inventory/stock-movement" },
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

      { label: "Tasks", route: "/crm/tasks" },
      { label: "Deals", route: "/crm/deals" },
      // { label: "Task details", route: "/crm/task-details" },
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

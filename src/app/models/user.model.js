// import moment from "moment";
import { isEmpty } from "lodash";
import config from "../../../config";
import { request } from "../helpers/request";
// import history from "../helpers/history";
import PendoService from "../services/pendo.service";
import WebStorageService from "../services/webstorage.service";
import WebStorageKey from "../enums/web-storage-key.enum";
// import { checkAchievementNotification } from "helpers/checkAchievementNotification";
import { updateUserPermissions } from "../helpers/updateUserPermissions";
import { updatePlanPermissions } from "../helpers/updatePlanPermissions";
const TOKEN_REFRESH_TIME = 15 * 1000 * 60;

class User {
  constructor() {
    const data = WebStorageService.getItem(WebStorageKey.USER, true) || {};
    this.id = data.id;
    this.autoCreateArticles = data.autoCreateArticles || false;
    this.companyAddress = data.companyAddress;
    this.googleId = data.googleId || "";
    this.invitationCode = data.invitationCode || "";
    this.isAdmin = data.isAdmin || false;
    this.isSmallBusiness = data.isSmallBusiness || false;
    this.loggedIn = data.loggedIn || false;
    this.logoPath = data.logoPath;
    this.pendoData = data.pendoData;
    this.subscriptionData = data.subscriptionData;
    this.registeredAt = data.registeredAt;
    this.registeredByReferral = data.registeredByReferral || false;
    this.registrationClient = data.registrationClient || "web";
    this.registrationStep = data.registrationStep;
    this.token = data.token;
    this.tokenCheckedAt = data.tokenCheckedAt;
    this.vatCodes = data.vatCodes;
    this.useOnboarding = data.useOnboarding || false;
    this.indiaStateId = data.indiaStateId;
    this.mobile = data.mobile;
    this.planId = data.planId;
    this.userEmail = data.userEmail;
    this.tenantId = data.tenantId;
    this.userId = data.userId;
    this.rights = data.rights || {};
    //this.multiUserVisible = this.checkMultiUserVisible();
    this.businessType = data.businessType;
    this.businessTurnover = data.businessTurnover;
    this.businessCategory = data.businessCategory;
    this.businessField = data.businessField;
    this.lastLogin = data.lastLogin;
    this.customerId = data.customerId;
    this.lastLogin = data.lastLogin;
    this.usedReferralCodes =
      data.usedReferralCodes ||
      (data.tokens && data.tokens.usedReferralCodes) ||
      undefined;
    this.razorpayKycProgress = data.razorpayKycProgress || null;
    this.razorpayKycStatus = data.razorpayKycStatus || null;
    this.planRights = data.planRights || {};
    setInterval(() => {
      this.checkToken();
    }, TOKEN_REFRESH_TIME);

    setTimeout(() => {
      request(`${config.resourceHost}utils/version`).then((response) => {
        const {
          body: { version },
        } = response;

        const elem = document.querySelector("#app-version");
        elem.innerHTML = version;
      });

      if (this.token) {
        checkAchievementNotification();
      }
    });

    setTimeout(() => {
      this.checkToken();

      if (this.loggedIn) {
        updateUserPermissions();
      }

      if (this.loggedIn) {
        updatePlanPermissions();
      }
    }, 1000);
  }

  checkToken() {
    const localData = WebStorageService.getItem(WebStorageKey.USER, true);

    if (
      localData &&
      localData.tokenCheckedAt &&
      new Date(localData.tokenCheckedAt)
    ) {
      if (
        moment().isAfter(
          moment(new Date(localData.tokenCheckedAt)).add(3, "hours")
        )
      ) {
        request(`${config.resourceHost}session/token`, {
          auth: true,
          method: "POST",
        }).then(
          ({
            body: {
              data: { token },
            },
          }) => {
            this.token = token;
            this.tokenCheckedAt = new Date().toISOString();
            WebStorageService.setItem(
              WebStorageKey.USER,
              JSON.stringify(this),
              true
            );
          }
        );
      }
    }
  }

  initializePendo(response) {
    const {
      body: {
        data: {
          tenantId,
          userId,
          registeredAt,
          planId,
          hasConfirmedEmail,
          companyType,
          registrationClient,
          useOnboarding,
          lastLogin,
        },
      },
    } = response;

    const pendoData = {
      id: userId,
      tenantId,
      planId,
      subscriptionType: planId,
      hasConfirmedEmail,
      companyType,
      registrationClient,
      useOnboarding,
      lastLogin,
    };

    if (registeredAt) {
      Object.assign(pendoData, { registeredAt });
    }

    this.pendoData = pendoData;
    PendoService.init(pendoData);
  }

  hasPermission(permission) {
    if (isEmpty(this.rights)) {
      this.logout();
    } else {
      return this.rights[permission];
    }
  }

  hasPlanPermission(permission) {
    if (isEmpty(this.planRights)) return false;
    return this.planRights[permission];
  }

  login(response) {
    const {
      body: {
        data: {
          isAdmin,
          googleId,
          registrationClient,
          registrationStep,
          registeredAt,
          token,
          useOnboarding,
          tenantId,
          userId,
          lastLogin,
          usedReferralCodes,
        },
      },
    } = response;
    this.loggedIn = true;
    this.isAdmin = isAdmin;
    this.googleId = googleId || "";
    this.registeredAt = registeredAt;
    this.registrationClient = registrationClient;
    this.registrationStep = registrationStep;
    this.token = token;
    this.tokenCheckedAt = new Date().toISOString();
    this.useOnboarding = useOnboarding;
    this.tenantId = tenantId;
    this.userId = userId;
    this.lastLogin = lastLogin;
    this.usedReferralCodes = usedReferralCodes;
    // this.initializePendo(response);
    updateUserPermissions();
    updatePlanPermissions();
    return new Promise((resolve, reject) => {
      request(config.account.endpoints.getTenantInfo, { auth: true })
        .then(this.setTenantInfo.bind(this))
        .then(() => {
          if (this.registrationStep === "legal_form") {
            resolve("/");
            return;
          } else if (this.registrationStep === "code") {
            resolve("/account/register/doi");
            return;
          } else if (this.registrationStep === "businesstype") {
            resolve("/account/register/businesstype");
            return;
          } else if (this.registrationStep === "businessturnover") {
            resolve("/account/register/businessturnover");
            return;
          } else if (this.registrationStep === "businesscategory") {
            resolve("/account/register/businesscategory");
            return;
          } else if (this.registrationStep === "mobile") {
            resolve("/account/register/mobile");
            return;
          }
          // else if (this.registrationStep === 'mobileotp') {
          // 	resolve('/account/register/mobile');
          // 	return;
          // }
          const returnUrl = WebStorageService.getItem(
            WebStorageKey.RETURN_AFTER_LOGIN,
            true
          );

          if (returnUrl) {
            if (returnUrl.indexOf("pendo") === -1) {
              resolve(returnUrl);
            } else {
              window.location.href = window.location.origin + returnUrl;
            }
          } else {
            resolve("/");
          }

          WebStorageService.removeItem(WebStorageKey.RETURN_AFTER_LOGIN, true);
          checkAchievementNotification();
        })
        .catch((err) => reject(err));
    });
  }

  logout(ignoreReferrer) {
    this.loggedIn = false;
    this.registrationStep = null;
    this.rights = null;

    const cachedSelectedBankAccounts = WebStorageService.getItem(
      WebStorageKey.SELECTED_BANK_ACCOUNTS,
      true
    );
    const cachedSelectedBankAccountsCockpit = WebStorageService.getItem(
      WebStorageKey.SELECTED_BANK_ACCOUNTS_COCKPIT,
      true
    );
    const invoiceListSettings = WebStorageService.getItem(
      WebStorageKey.INVOICE_LIST_SETTINGS,
      true
    );
    const deliveryChallanListSettings = WebStorageService.getItem(
      WebStorageKey.DELIVERYCHALLAN_LIST_SETTINGS,
      true
    );
    const recurringInvoiceListSettings = WebStorageService.getItem(
      WebStorageKey.RECURRING_INVOICE_LIST_SETTINGS,
      true
    );
    const projectListSettings = WebStorageService.getItem(
      WebStorageKey.PROJECT_LIST_SETTINGS,
      true
    );
    const timetrackingListSettings = WebStorageService.getItem(
      WebStorageKey.TIMETRACKING_LIST_SETTINGS,
      true
    );
    const offerListSettings = WebStorageService.getItem(
      WebStorageKey.OFFER_LIST_SETTINGS,
      true
    );
    const offerImpressListSettings = WebStorageService.getItem(
      WebStorageKey.OFFER_IMPRESS_LIST_SETTINGS,
      true
    );
    const customerListSettings = WebStorageService.getItem(
      WebStorageKey.CUSTOMER_LIST_SETTINGS,
      true
    );
    const articleListSettings = WebStorageService.getItem(
      WebStorageKey.ARTICLE_LIST_SETTINGS,
      true
    );
    const expenseListSettings = WebStorageService.getItem(
      WebStorageKey.EXPENSE_LIST_SETTINGS,
      true
    );
    const customerHistoryListSettings = WebStorageService.getItem(
      WebStorageKey.CUSTOMER_HISTORY_LIST_SETTINGS,
      true
    );
    const customerDocumentsListSettings = WebStorageService.getItem(
      WebStorageKey.CUSTOMER_DOCUMENTS_LIST_SETTINGS,
      true
    );
    const articleHistoryListSettings = WebStorageService.getItem(
      WebStorageKey.ARTICLE_HISTORY_LIST_SETTINGS,
      true
    );
    const inventoryListSettings = WebStorageService.getItem(
      WebStorageKey.INVENTORY_LIST_SETTINGS,
      true
    );
    const articlePOEntry = WebStorageService.getItem(
      WebStorageKey.ARTICLE_PO_ENTRY,
      true
    );
    const trackStockScroll = WebStorageService.getItem(
      WebStorageKey.TRACK_STOCK_SCROLL,
      true
    );
    const cancellationListSettings = WebStorageService.getItem(
      WebStorageKey.CANCELLATION_LIST_SETTINGS,
      true
    );
    const purchaseOrderListSettings = WebStorageService.getItem(
      WebStorageKey.PURCHASEORDER_LIST_SETTINGS,
      true
    );
    const debitCancellationListSettings = WebStorageService.getItem(
      WebStorageKey.DEBIT_CANCELLATION_LIST_SETTINGS,
      true
    );
    WebStorageService.clear();

    if (!ignoreReferrer && document.location.pathname !== "/account/login") {
      WebStorageService.setItem(
        WebStorageKey.RETURN_AFTER_LOGIN,
        document.location.pathname,
        true
      );
    } else if (ignoreReferrer) {
      WebStorageService.setItem(WebStorageKey.RETURN_AFTER_LOGIN, "/", true);
    }

    WebStorageService.setItem(
      WebStorageKey.SELECTED_BANK_ACCOUNTS,
      cachedSelectedBankAccounts,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.SELECTED_BANK_ACCOUNTS_COCKPIT,
      cachedSelectedBankAccountsCockpit,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.INVOICE_LIST_SETTINGS,
      invoiceListSettings,
      true
    );
    WebStorageService.getItem(
      WebStorageKey.DELIVERYCHALLAN_LIST_SETTINGS,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.RECURRING_INVOICE_LIST_SETTINGS,
      recurringInvoiceListSettings,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.PROJECT_LIST_SETTINGS,
      projectListSettings,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.TIMETRACKING_LIST_SETTINGS,
      timetrackingListSettings,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.OFFER_LIST_SETTINGS,
      offerListSettings,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.OFFER_IMPRESS_LIST_SETTINGS,
      offerImpressListSettings,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.CUSTOMER_LIST_SETTINGS,
      customerListSettings,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.ARTICLE_LIST_SETTINGS,
      articleListSettings,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.EXPENSE_LIST_SETTINGS,
      expenseListSettings,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.CUSTOMER_HISTORY_LIST_SETTINGS,
      customerHistoryListSettings,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.CUSTOMER_DOCUMENTS_LIST_SETTINGS,
      customerDocumentsListSettings,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.ARTICLE_HISTORY_LIST_SETTINGS,
      articleHistoryListSettings,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.INVENTORY_LIST_SETTINGS,
      inventoryListSettings,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.ARTICLE_PO_ENTRY,
      articlePOEntry,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.TRACK_STOCK_SCROLL,
      trackStockScroll,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.CANCELLATION_LIST_SETTINGS,
      cancellationListSettings,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.PURCHASEORDER_LIST_SETTINGS,
      purchaseOrderListSettings,
      true
    );
    WebStorageService.setItem(
      WebStorageKey.DEBIT_CANCELLATION_LIST_SETTINGS,
      debitCancellationListSettings,
      true
    );
    location.assign("/");
  }

  setTenantInfo(response) {
    const {
      body: { data },
    } = response;
    const {
      isSmallBusiness,
      vatCodes,
      autoCreateArticles,
      razorpayKycProgress,
      razorpayKycStatus,
    } = data;
    const invitationCode = data.invitationCode || "";
    const registeredByReferral = data.registeredByReferral || false;
    const logoPath = data.logoPath;
    const companyAddress = data.companyAddress || null;

    this.isSmallBusiness = isSmallBusiness;
    this.vatCodes = vatCodes;
    this.autoCreateArticles = autoCreateArticles || false;
    this.invitationCode = invitationCode;
    this.registeredByReferral = registeredByReferral;
    this.logoPath = logoPath;
    this.companyAddress = companyAddress;
    this.indiaStateId = data.indiaStateId;
    this.mobile = data.mobile;
    this.userEmail = data.email;
    this.planId = data.planId;
    this.businessType = data.businessType;
    this.businessTurnover = data.businessTurnover;
    this.businessCategory = data.businessCategory;
    this.businessField = data.businessField;
    this.razorpayKycProgress = razorpayKycProgress;
    this.razorpayKycStatus = razorpayKycStatus;
  }
}

const handler = {
  get(target, name) {
    return target[name];
  },

  set(target, name, value) {
    if (target.hasOwnProperty(name)) {
      target[name] = value;
      WebStorageService.setItem(
        WebStorageKey.USER,
        JSON.stringify(target),
        true
      );
    }

    return true;
  },
};

const user = new User();

if (!window.Proxy) {
  window.Proxy = function () {};
}
export default new Proxy(user, handler);

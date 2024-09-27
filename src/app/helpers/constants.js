import { dateCompare } from "./sortComparators";
// import config from '../config';

export const dateConstants = {
  YEAR: "year",
  MONTH: "month",
};

export const customerTypes = {
  COMPANY: "company",
  PERSON: "person",
};

export const contactTypes = {
  CUSTOMER: "customer",
  PAYEE: "payee",
};

export const balanceTypes = {
  NEW_CUSTOMER: `new`,
  EXCESS: `excess`,
  DUES: `dues`,
};

export const balanceLabels = {
  NEW_CUSTOMER_LABEL: `A new customer has an opening balance of 0`,
  EXCESS_LABEL: `The customer has paid an excess amount of`,
  DUES_LABEL: `The customer owes you`,
  PAYEE_DUES_LABEL: `You owe the payee`,
};

export const columnViewStates = {
  COLUMN_VIEW_STATE_DISPLAY: "display",
  COLUMN_VIEW_STATE_FORM: "form",
};

export const recipientStates = {
  RECIPIENT_STATE_EMPTY: "empty",
  RECIPIENT_STATE_FORM: "form",
  RECIPIENT_STATE_SELECT: "select",
  RECIPIENT_STATE_CUSTOMER_SELECTED: "selected",
};

export const notesStates = {
  NOTES_DISPLAY_STATE: "display",
  NOTES_FORM_STATE: "form",
};

export const DateFilterType = Object.freeze({
  NONE: "none",
  FISCAL_YEAR: "fiscalYear",
  CURR_MONTH: "currMonth",
  LAST_MONTH: "lastMonth",
  SECOND_LAST_MONTH: "secondLastMonth",
  CURR_QUARTER: "currQuarter",
  LAST_QUARTER: "lastQuarter",
  SECOND_LAST_QUARTER: "secondLastQuarter",
  CUSTOM: "custom",
});

// move this constant json into lang resource file
export const errorCodesWithMessages = [
  { type: "INCORRECT", message: "%s ist falsch" },
  { type: "INVALID", message: "%s ist nicht gültig" },
  { type: "NO_INTEGER", message: "Bitte gib eine valide Zahl ein" },
  { type: "NO_NUMBER", message: "Bitte gib eine valide Gleitkommazahl ein" },
  { type: "NO_DATE", message: "Bitte gib ein valides Datum ein" },
  {
    type: "NO_DATETIME",
    message: "Bitte gib ein valides Datum mit Uhrzeit ein",
  },
  { type: "NO_STRING", message: "Bitte gib einen validen Text ein" },
  { type: "NOT_ALLOWED", message: "%s ist nicht gültig" },
  { type: "NOT_FOUND", message: "%s existiert nicht" },
  { type: "NOT_POSITIVE", message: "Der eingegebene Wert muss positiv sein" },
  { type: "REQUIRED", message: "Dies ist ein Pflichtfeld" },
  { type: "TOO_SMALL", message: "Der eingegebene Wert ist zu klein" },
  { type: "TOO_LARGE", message: "Der eingegebene Wert ist zu groß" },
  { type: "EXISTS", message: "%s existiert bereits" },
];

export const errorCodes = {
  REQUIRED: "REQUIRED",
  NOT_EMPTY: "NOT_EMPTY",
  INCORRECT: "INCORRECT",
  INVALID: "INVALID",
  NO_INTEGER: "NO_INTEGER",
  NO_NUMBER: "NO_NUMBER",
  NO_DATE: "NO_DATE",
  NO_DATETIME: "NO_DATETIME",
  NO_STRING: "NO_STRING",
  NOT_ALLOWED: "NOT_ALLOWED",
  NOT_FOUND: "NOT_FOUND",
  NOT_POSITIVE: "NOT_POSITIVE",
  NOT_CONFIRMED: "NOT_CONFIRMED",
  TOO_SMALL: "TOO_SMALL",
  TOO_LARGE: "TOO_LARGE",
  TOO_MANY: "TOO_MANY",
  IS_CONFIRMED: "IS_CONFIRMED",
  EXISTS: "EXISTS",
};

// offer states
export const offerStates = {
  DRAFT: "draft",
  OPEN: "open",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  INVOICED: "invoiced",
  PROJECT_CREATED: "projectCreated",
};

// invoice states
export const invoiceStates = {
  DRAFT: "draft",
  LOCKED: "locked",
  CANCELLED: "cancelled",
  DUNNED: "dunned",
  PAID: "paid",
  PARTIALLYPAID: "partiallyPaid",
  UNCOLLECTIBLE: "uncollectible",
  PRINTED: "printed",
  SENT: "sent",
  RECURRINGINVOICETEMPLATE: "recurringTemplate",
};

export const projectStates = {
  DRAFT: "draft",
  STARTED: "started",
  FINISHED: "finished",
  PAID: "paid",
};

export const serviceAgreement = {
  url: "https://www.invoiz.de/agb-datenschutz/",
};

export const advancedPaymentSettings = {
  UNDECIDED: "undecided",
  INDIVIDUALLY: "individually",
  DISABLED: "disabled",
  ENABLED: "enabled",
  HIDDEN: "hidden",
};

export const transactionTypes = {
  TRANSACTION_TYPE_OFFER: "offer",
  TRANSACTION_TYPE_PURCHASE_ORDER: "purchaseOrder",
  TRANSACTION_TYPE_INVOICE: "invoice",
  TRANSACTION_TYPE_DUNNING: "dunning",
  TRANSACTION_TYPE_CANCELLATION: "cancellation",
  TRANSACTION_TYPE_DEPOSIT_INVOICE: "depositInvoice",
  TRANSACTION_TYPE_CLOSING_INVOICE: "closingInvoice",
  TRANSACTION_TYPE_RECURRING_INVOICE: "recurringInvoice",
  TRANSACTION_TYPE_STANDAED_QUOTATION: "standard",
  TRANSACTION_TYPE_IMPRESS_QUOTATION: "impress",
  TRANSACTION_TYPE_EXPENSE: "expense",
  TRANSACTION_TYPE_PURCHASE: "purchase",
  TRANSACTION_TYPE_POS_RECEIPT: "pos_receipt",
  TRANSACTION_TYPE_CANCELLATION_DEBIT: "debitNotes",
};

export const columnNames = {
  DESCRIPTION: "description",
  NUMBER: "number",
  AMOUNT: "amount",
  VAT: "vat",
  PRICE: "price",
  DISCOUNT: "discount",
  TOTAL: "total",
};

// currently not in use
export const columnPlaceholders = {
  DESCRIPTION: "Bezeichnung",
  NUMBER: "Artikel-Nr.",
  AMOUNT: "Menge",
  VAT: "MwSt.",
  PRICE: "Preis",
  DISCOUNT: "Rabatt",
  TOTAL: "Gesamt",
};

export const htmlInputEmptyStates = {
  DEFAULT_HTML_EMPTY_STATE: "<p><br></p>",
  HTML_LIST_EMPTY_STATE: "<ul><li><br></li></ul>",
};

export const notificationTypes = {
  NOTIFICATION_TYPE_EMAIL: "email",
  NOTIFICATION_TYPE_SMARTPHONE: "smartphone",
};

export const registrationStates = {
  NOT_CONFIRMED: "notConfirmed",
  NOT_CONFIRMED_ERROR: "notConfirmedError",
};

export const letterHeaderStates = {
  LETTER_HEADER_EMPTY_STATE: "empty",
  LETTER_HEADER_DISPLAY_STATE: "display",
  LETTER_HEADER_EDIT_STATE: "edit",
};

export const letterHeaderConstants = {
  DEFAULT_FONT_SIZE: 18,
};

export const DetailViewConstants = {
  VIEWPORT_BREAKPOINT: 1670,
};

export const RouteTypes = {
  PRIVATE: "private",
  PUBLIC: "public",
  ROUTE: "route",
};

export const TodoInterpolators = {
  START: "[[",
  END: "]]",
};

export const PlanLimitAndPrice = {
  smallContingentLimit: "50 lacs ",
  mediumContingentLimit: "1 Cr. ",
  smallPlanAmount: "499",
  smallPlanAmountNew: "249",
  mediumPlanAmount: "1,499",
  mediumPlanAmountNew: "749",
  LargePlanAmount: "1,999",
  LargePlanAmountNew: "999",
  smallPlanMaxLimit: "2",
  mediumPlanMaxLimit: "5",
  smallPlanAmountYearlyDiscount: "5,389",
  mediumPlanAmountYearlyDiscount: "16,189",
  LargePlanAmountYearlyDiscount: "21,589",
  smallPlanAmountYearly: "5,988",
  mediumPlanAmountYearly: "17,988",
  LargePlanAmountYearly: "23,988",

  freeContingentLimit: "10 lacs ",
  freefivelacContingentLimit: "5 lacs ",
  freeTenLacContingentLimit: 1000000,
  freeMaxLimit: "1",
  // new yearly plans
  startupContingentLimit: "10 lacs ",
  businessContingentLimit: "50 lacs ",
  growthContingentLimit: "1 Cr. ",
  startupMaxLimit: "2",
  businessMaxLimit: "2",
  growthMaxLimit: "5",
  startupPlanAmount: "999",
  startupPlanAmountNew: "0",
  businessPlanAmount: "4,999",
  businessPlanAmountNew: "2,499",
  growthPlanAmount: "17,999",
  growthPlanAmountNew: "8,999",
  unlimitedPlanAmount: "23,999",
  unlimitedPlanAmountNew: "11,999",
};

// Currency options

export const currencyOptions = [
  {
    label: `1 USD`,
    value: `USD`,
  },
  {
    label: `1 CAD`,
    value: `CAD`,
  },
  {
    label: `1 GBP`,
    value: `GBP`,
  },
  {
    label: `1 AED`,
    value: `AED`,
  },
  {
    label: `1 SGD`,
    value: `SGD`,
  },
  {
    label: `1 EUR`,
    value: `EUR`,
  },
  {
    label: `1 MYR`,
    value: `MYR`,
  },
  {
    label: `1 PHP`,
    value: `PHP`,
  },
  {
    label: `1 BHD`,
    value: `BHD`,
  },
  {
    label: `1 KWD`,
    value: `KWD`,
  },
  {
    label: `1 OMR`,
    value: `OMR`,
  },
  {
    label: `1 QAR`,
    value: `QAR`,
  },
  {
    label: `1 SAR`,
    value: `SAR`,
  },
  {
    label: `1 AUD`,
    value: `AUD`,
  },
];

export const gstTypeOptions = [
  {
    label: `SEZ`,
    value: `SEZ`,
  },
  {
    label: `Deemed/Export`,
    value: `Deemed/Export`,
  },
  {
    label: `Registered`,
    value: `Registered`,
  },
  {
    label: `Unregistered`,
    value: `Unregistered`,
  },
];

export const currencyInputCode = "code";
export const currencyInputSymbol = "symbol";

export const PAYMENT_TYPE_PAYMENT = "payment"; // vollständig vezahlt
export const PAYMENT_TYPE_MORE_CREDIT = "credit"; // als Kundenguthaben verbuchen
export const PAYMENT_TYPE_MORE_SURCHARGE = "surcharge"; // Gebühr/Zuschlag
export const PAYMENT_TYPE_MORE_SETTLE = "settle"; // mit anderen Rechnungen verrechnen
export const PAYMENT_TYPE_LESS_PARTIAL = "partial"; // Teilzahlung
export const PAYMENT_TYPE_LESS_DISCOUNT = "discount"; // Skonto/Nachlass
export const PAYMENT_TYPE_LESS_BANKCHARGE = "bankcharge"; // Bankgebühr
export const PAYMENT_TYPE_LESS_TDSCHARGE = "tdscharge";
export const PAYMENT_TYPE_SOFORT = "sofort";
export const PAYMENT_TYPE_GIROPAY = "giropay";
export const PAYMENT_TYPE_CREDITCARD = "card";
export const PAYMENT_TYPE_EXCESS = "excessAmount";
// setiing-document-export
export const exportOption = [
  {
    id: "tally",
    label: "Tally",
    value: "Tally",
  },
  {
    id: "csv",
    label: "CSV",
    value: "CSV",
  },
];

const dateFormat = {
  api: "YYYY-MM-DD",
  client: "DD-MM-YYYY",
};

// ListView Settings
export const ListAdvancedDefaultSettings = {
  CellInlineActionType: {
    MAIL: "mail",
    MAPS: "maps",
    PHONE: "phone",
    WEBSITE: "website",
    VIEW: "view",
  },
  COLUMN_MIN_WIDTH: 140,
  CUSTOMER_TYPE_CONTACTPERSON: "contactPerson",
  DATE_FILTER_PARAMS_OPTIONS: [
    {
      displayKey: "equals",
      displayName: "Equal to",
      test: (filterValue, cellValue) => {
        return dateCompare(filterValue, cellValue, dateFormat.client) > 0;
      },
    },
    {
      displayKey: "greaterThanDate",
      displayName: "After date >",
      test: (filterValue, cellValue) => {
        return dateCompare(filterValue, cellValue, dateFormat.client) > 0;
      },
    },
    {
      displayKey: "lessThanDate",
      displayName: "Before date <",
      test: (filterValue, cellValue) => {
        return dateCompare(filterValue, cellValue, dateFormat.client) < 0;
      },
    },
    "notEqual",
    "inRange",
  ],
  EXCEL_STYLE_IDS: {
    // Also used as styles in styles/vendor/_ag-grid-theme-invoiz.scss
    Currency: "ExcelCurrency",
    Percentage: "ExcelPercentage",
    String: "ExcelString",
    Date: "ExcelDate",
  },
  TEXT_FILTER_OPTIONS: {
    filter: "agTextColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
      suppressAndOrCondition: true,
    },
    customProps: {
      isFilterBodyOnly: true,
    },
  },
  TEXT_FILTER_OPTIONS_PHONE: {
    filter: "agTextColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
      suppressAndOrCondition: true,
      textCustomComparator: function (_, value, filterText) {
        const filterTextLowerCase = filterText
          .toLowerCase()
          .replace(/[()/+-\s]/gi, "");

        const valueLowerCase = value
          .toString()
          .toLowerCase()
          .replace(/[()/+-\s]/gi, "");

        return (
          valueLowerCase && valueLowerCase.indexOf(filterTextLowerCase) >= 0
        );
      },
    },
    customProps: {
      isFilterBodyOnly: true,
    },
  },
};

export const RegExPatterns = {
  HTTP_HTTPS: /^(http|https):\/\//,
};

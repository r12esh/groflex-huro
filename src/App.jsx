import Home from "./app/views/home/Home";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SharedLayout from "./app/shared/sharedLayout/SharedLayout";
import Login from "./app/views/account/Login";
import Signup from "./app/views/account/Signup";
import Estimates from "./app/views/estimates/Estimates";
import Articles from "./app/views/articles/Articles";
import Dashboard from "./app/views/dashboard/Dashboard";
import AccountSettings from "./app/views/accountSettings/AccountSettings";
import Preferences from "./app/views/preferences/Preferences";
import Notifications from "./app/views/notifications/Notifications";
import Contacts from "./app/views/contacts/Contacts";
import Transactions from "./app/views/accounting/transactions/Transactions";
import CashAndBank from "./app/views/accounting/cashAndBank/CashAndBankList";
import CreateArticle from "./app/views/articles/CreateArticle";
import CreateContact from "./app/views/contacts/CreateContact";
import EditContact from "./app/views/contacts/EditContact";
import EmailVerification from "./app/views/account/EmailVerification";
import store from "./app/redux/store";
import MobileVerification from "./app/views/account/MobileVerification";
import EditArticle from "./app/views/articles/EditArticle";
import ArticleDetail from "./app/views/articles/ArticleDetail";
import "./assets/scss/main.scss";
import "./styles/app.scss";
import TasksOverview from "./app/views/crm/tasks/TasksOverview";
import DealsOverview from "./app/views/crm/deals/DealsOverview";
import ContactManagement from "./app/views/crm/contactManagement/ContactManagement";
import CrmCreateForm from "./app/views/crm/CrmCreateForm";
import LeadOverview from "./app/views/crm/leads/LeadOverview";
import LeadDetails from "./app/views/crm/leads/LeadDetails";
import ContactManagementDetails from "./app/views/crm/contactManagement/ContactManagementDetails";
import TaskDetails from "./app/views/crm/tasks/TaskDetails";
import CrmCreateContact from "./app/views/crm/contactManagement/CrmCreateContact";
import CreateLead from "./app/views/crm/leads/CreateLead";

import InvoicesList from "./app/views/sales/invoices/InvoicesList";
import QuotationsList from "./app/views/sales/quotations/QuotationsList";
import RecurringInvoicesList from "./app/views/sales/recurringInvoices/RecurringInvoicesList";
import TimesheetsList from "./app/views/sales/timeTracking/TimesheetsList";
import DebitNotesList from "./app/views/accounting/debitNote/DebitNotesList";
import InventoryDashboard from "./app/views/inventory/inventoryDashboard/InventoryDashboard";
import PurchaseOrderList from "./app/views/inventory/purchaseOrder/PurchaseOrderList";
import SalesOrdersList from "./app/views/inventory/salesOrder/SalesOrdersList";
import ReportingAndAnalytics from "./app/views/inventory/reportingAndAnalytics/ReportingAndAnalytics";
import InvoiceDetail from "./app/views/sales/invoices/InvoiceDetail";
import QuotationDetail from "./app/views/sales/quotations/QuotationDetail";
import InvoiceEditWrapper from "./app/views/sales/invoices/InvoiceEditWrapper";
// import CreateInvoiceWrapper from "./app/views/sales/invoices/CreateInvoiceWrapper";
import CreateDeal from "./app/views/crm/deals/CreateDeal";
import DealDetails from "./app/views/crm/deals/DealDetails";
import Teams from "./app/views/teams/Teams";
import Reports from "./app/views/accounting/reports/Reports";
import BalanceSheet from "./app/views/accounting/reports/BalanceSheet";
import ProfitAndLoss from "./app/views/accounting/reports/ProfitAndLoss";
import GeneralLedger from "./app/views/accounting/reports/GeneralLedger";
import CashFlow from "./app/views/accounting/reports/CashFlow";
import GstReports from "./app/views/accounting/reports/GstReports";
import ContactsDetail from "./app/views/contacts/ContactsDetail";
import CreditNotesList from "./app/views/accounting/creditNotes/CreditNotesList";
import ExpensesList from "./app/views/accounting/expenses/ExpensesList";
import ChartOfAccounts from "./app/views/accounting/chartOfAccounts/ChartOfAccountsList";
import TimesheetsBilling from "./app/views/sales/timeTracking/TimesheetsBilling";
import StockMovement from "./app/views/inventory/stockMovement/StockMovement";
import ProformaInvoicesListWrapper from "./app/views/sales/proformaInvoice/ProformaInvoicesListWrapper";
import ProformaInvoiceDetailWrapper from "./app/views/sales/proformaInvoice/ProformaInvoiceDetailWrapper";
import ProformaInvoiceEditWrapper from "./app/views/sales/proformaInvoice/ProformaInvoiceEditWrapper";
import VendorPaymentsList from "./app/views/accounting/vendorPayments/VendorPaymentsList";
import VendorPaymentDetailWrapper from "./app/views/accounting/vendorPayments/VendorPaymentDetailWrappet";
import RecordTime from "./app/views/sales/timeTracking/RecordTime";
import Gstr1List from "./app/views/accounting/reports/Gstr1List";
import Gstr2AList from "./app/views/accounting/reports/Gstr2AList";
import Gstr3BList from "./app/views/accounting/reports/Gstr3BList";
import DeliveryChallan from "./app/views/accounting/deliveryChallan/DeliveryChallan";
import BillingInfo from "./app/views/billingInfo/BillingInfo";
import DeliveryChallanDetail from "./app/views/accounting/deliveryChallan/DeliveryChallanDetail";

store.subscribe(() => {
  // console.log(store.getState());
});

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="estimates" element={<Estimates />} />

          {/* Articles */}
          <Route path="articles" element={<Articles />} />
          <Route path="articles/:articleId" element={<ArticleDetail />} />
          <Route path="articles/new" element={<CreateArticle />} />
          <Route path="articles/edit/:articleId" element={<EditArticle />} />

          {/* ---------------------------Contacts-------------------------------- */}
          <Route path="contacts" element={<Contacts />} />
          <Route path="contacts-create" element={<CreateContact />} />
          <Route path="contacts-edit/:contactId" element={<CreateContact />} />
          <Route path="contacts/:contactId" element={<ContactsDetail />} />
          {/* <Route path="contacts-edit/:contactId" element={<EditContact />} /> */}

          {/* -------------------------Sales Module-------------------------*/}
          {/* Invoice */}
          <Route path="sales/invoices" element={<InvoicesList />} />
          <Route path="sales/invoices/:invoiceId" element={<InvoiceDetail />} />
          <Route
            path="sales/invoices/edit/:invoiceId"
            element={<InvoiceEditWrapper />}
          />
          {/* Proforma Invoice */}
          <Route
            path="sales/proforma-invoices"
            element={<ProformaInvoicesListWrapper />}
          />
          <Route
            path="sales/proforma-invoices/:id"
            element={<ProformaInvoiceDetailWrapper />}
          />
          <Route
            path="sales/proforma-invoices/edit/:id"
            element={<ProformaInvoiceEditWrapper />}
          />
          {/* Quotation */}
          <Route path="sales/quotations" element={<QuotationsList />} />
          <Route
            path="/sales/quotations/:quotationId"
            element={<QuotationDetail />}
          />
          {/* Recurring invoice */}
          <Route
            path="sales/recurring-invoices"
            element={<RecurringInvoicesList />}
          />
          <Route path="sales/time-sheets" element={<TimesheetsList />} />
          <Route
            path="sales/time-sheets/billed/customer/:customerId/:status"
            element={<TimesheetsBilling />}
          />
          <Route
            path="sales/time-sheets/record-time"
            element={<RecordTime />}
          />
          <Route
            path="sales/time-sheets/record-time/:trackId"
            element={<RecordTime />}
          />

          {/* --------------------Accounting Module-------------------- */}
          <Route path="accounting/transactions" element={<Transactions />} />
          <Route path="accounting/cash-and-bank" element={<CashAndBank />} />
          <Route path="accounting/debit-notes" element={<DebitNotesList />} />
          <Route path="accounting/credit-notes" element={<CreditNotesList />} />
          <Route path="accounting/expenses" element={<ExpensesList />} />
          <Route
            path="accounting/vendor-payments"
            element={<VendorPaymentsList />}
          />
          <Route
            path="accounting/vendor-payments/:id"
            element={<VendorPaymentDetailWrapper />}
          />
          <Route path="accounting/reports" element={<Reports />} />
          <Route
            path="accounting/chart-of-accounts"
            element={<ChartOfAccounts />}
          />
          <Route
            path="accounting/reports/balance-sheet"
            element={<BalanceSheet />}
          />
          <Route
            path="accounting/reports/profit-and-loss"
            element={<ProfitAndLoss />}
          />
          <Route
            path="accounting/reports/general-ledger"
            element={<GeneralLedger />}
          />
          <Route path="accounting/reports/cash-flow" element={<CashFlow />} />
          <Route
            path="accounting/reports/gst-reports"
            element={<GstReports />}
          />
          <Route
            path="accounting/reports/gst-reports/gstr-1/:reportId"
            element={<Gstr1List />}
          />
          <Route
            path="accounting/reports/gst-reports/gstr-2A/:reportId"
            element={<Gstr2AList />}
          />
          <Route
            path="accounting/reports/gst-reports/gstr-3B/:reportId"
            element={<Gstr3BList />}
          />

          <Route
            path="accounting/delivery-challan"
            element={<DeliveryChallan />}
          />
          <Route
            path="accounting/delivery-challan/:deliveryChallanId"
            element={<DeliveryChallanDetail />}
          />

          {/* Inventory Module */}
          <Route path="inventory/dashboard" element={<InventoryDashboard />} />
          <Route
            path="inventory/purchase-orders"
            element={<PurchaseOrderList />}
          />
          <Route path="inventory/stock-movement" element={<StockMovement />} />
          <Route path="inventory/sales-orders" element={<SalesOrdersList />} />
          <Route
            path="inventory/reporting-and-analytics"
            element={<ReportingAndAnalytics />}
          />

          {/* -------------------------CRM Module----------------------- */}
          <Route
            path="/crm/contact-management"
            element={<ContactManagement />}
          />
          <Route
            path="/crm/contact-management/create-contact"
            element={<CrmCreateContact />}
          />
          <Route path="/crm/create-form" element={<CrmCreateForm />} />
          <Route path="/crm/leads" element={<LeadOverview />} />
          <Route path="/crm/leads/:leadId" element={<LeadDetails />} />
          <Route path="/crm/leads/create-lead" element={<CreateLead />} />
          <Route
            path="/crm/contact-management/:contactManagementId"
            element={<ContactManagementDetails />}
          />
          <Route path="/crm/deals" element={<DealsOverview />} />
          <Route path="/crm/deals/create-deal" element={<CreateDeal />} />
          <Route path="/crm/deals/deal-details" element={<DealDetails />} />
          <Route path="/crm/tasks" element={<TasksOverview />} />
          <Route path="/crm/tasks/edit" element={<TaskDetails />} />
          <Route path="/crm/tasks/edit/:taskId" element={<TaskDetails />} />

          {/* ---------------------Miscilaneous----------------------*/}
          <Route path="account-settings" element={<AccountSettings />} />
          <Route path="billing-info" element={<BillingInfo />} />
          <Route path="preferences" element={<Preferences />} />
          {/* <Route path="notifications" element={<Notifications />} /> */}
          <Route path="teams" element={<Teams />} />
        </Route>

        {/* -------------------Unprotected Routes------------------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/mobile-verification" element={<MobileVerification />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

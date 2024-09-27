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
          <Route path="article/:articleId" element={<ArticleDetail />} />
          <Route path="article/new" element={<CreateArticle />} />
          <Route path="article/edit/:articleId" element={<EditArticle />} />

          {/* ---------------------------Contacts-------------------------------- */}
          <Route path="contacts" element={<Contacts />} />
          <Route path="contacts-create" element={<CreateContact />} />
          <Route path="contacts-edit/:contactId" element={<EditContact />} />

          {/* -------------------------Sales Module-------------------------*/}
          {/* Invoice */}
          <Route path="sales/invoices" element={<InvoicesList />} />
          <Route
            path="sales/invoices/:invoiceId"
            element={<InvoiceDetail />}
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

          {/* --------------------Accounting Module-------------------- */}
          <Route path="accounting/transactions" element={<Transactions />} />
          <Route path="accounting/cash-and-bank" element={<CashAndBank />} />
          <Route path="accounting/debit-notes" element={<DebitNotesList />} />

          {/* ---------------------Inventory Module------------------------- */}
          <Route path="inventory/dashboard" element={<InventoryDashboard />} />
          <Route
            path="inventory/purchase-orders"
            element={<PurchaseOrderList />}
          />
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
          <Route path="/crm/deals-overview" element={<DealsOverview />} />
          <Route path="/crm/tasks-overview" element={<TasksOverview />} />
          <Route path="/crm/task-details" element={<TaskDetails />} />

          {/* ---------------------Miscilaneous----------------------*/}
          <Route path="account-settings" element={<AccountSettings />} />
          <Route path="preferences" element={<Preferences />} />
          <Route path="notifications" element={<Notifications />} />
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

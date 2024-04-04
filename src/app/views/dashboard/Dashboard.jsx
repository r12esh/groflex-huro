import React, { useEffect, useState } from "react";
import PageContent from "../../shared/components/pageContent/PageContent";
import { FeatherIcon } from "../../shared/featherIcon/FeatherIcon";
import { AdvancedCard } from "../../shared/components/cards/AdvancedCard";
import Tabs from "../../shared/components/tabs/Tabs";

import DashBoardInvoiceTab from "./DashBoardInvoiceTab";
import DashboardExpenseTab from "./DashboardExpenseTab";
import DashboardQuotation from "./DashboardQuotationTab";
import DashboardSalesExpenseStats from "./DashboardSalesExpenseStats";
import DashboardSalesByArticle from "./DashboardSalesByArticle";
import DashboardSalesByCustomer from "./DashboardSalesByCustomer";
import DashboardExpenseByArticle from "./DashboardExpenseByArticle";
import DashboardExpenseByPayee from "./DashboardExpenseByPayee";
import groflexService from "../../services/groflex.service";
import config from "../../../../newConfig";
import moment from "moment";
import DashBoardSummaryCard from "./DashBoardSummaryCard";
import { Button } from "../../shared/components/button/Button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [receivablesCard, setReceivablesCard] = useState({
    invoices: [],
    totalAmount: 0,
    overdue3Days: 0,
    overdue15Days: 0,
    overdue45Days: 0,
    overdueAbove45days: 0,
  });

  const [payableCard, setPayableCard] = useState({
    expenses: [],
    totalAmount: 0,
    overdue3Days: 0,
    overdue15Days: 0,
    overdue45days: 0,
    overdueAbove45days: 0,
  });

  useEffect(() => {
    fetchRecievablesData();
    fetchPayableData();
  }, []);
  const fetchRecievablesData = async () => {
    const response = await groflexService.request(
      `${config.resourceUrls.recievables}`,
      { auth: true }
    );

    const invoices = response.body.data;
    const lockedInvoices = invoices.filter(
      (invoice) => invoice.state === "locked"
    );
    const totalAmount = invoices.reduce(
      (sum, item) => sum + item.outstandingAmount,
      0
    );
    const overdue3Days = findOverdueByDaysInvoices(3, invoices);
    const overdue15Days =
      findOverdueByDaysInvoices(15, invoices) - overdue3Days;
    const overdue45Days =
      findOverdueByDaysInvoices(45, invoices) -
      findOverdueByDaysInvoices(15, invoices);
    const overdueAbove45days =
      totalAmount - findOverdueByDaysInvoices(45, invoices);

    setReceivablesCard({
      invoices: lockedInvoices,
      totalAmount: totalAmount,
      overdue3Days: overdue3Days,
      overdue15Days: overdue15Days,
      overdue45Days: overdue45Days,
      overdueAbove45days: overdueAbove45days,
    });
  };

  const fetchPayableData = async () => {
    const response = await groflexService.request(
      `${config.resourceUrls.payable}`,
      { auth: true }
    );

    const expenses = response.body.data.filter(
      (invoice) => invoice.status === "open"
    );

    const totalAmount = expenses.reduce(
      (sum, item) => sum + item.totalGross,
      0
    );

    const overdue3Days = findOverdueByDaysExpenses(3, expenses);
    const overdue15Days =
      findOverdueByDaysExpenses(15, expenses) - overdue3Days;
    const overdue45Days =
      findOverdueByDaysExpenses(45, expenses) -
      findOverdueByDaysExpenses(15, expenses);
    const overdueAbove45days =
      totalAmount - findOverdueByDaysExpenses(45, expenses);

    setPayableCard({
      expenses: expenses,
      overdue3Days: overdue3Days,
      overdue15Days: overdue15Days,
      overdue45days: overdue45Days,
      overdueAbove45days: overdueAbove45days,
      totalAmount: totalAmount,
    });
  };

  const findOverdueByDaysExpenses = (days, expenses) => {
    return expenses.reduce((sum, item) => {
      const noOfDaysDue = moment().diff(item.date, "days");
      if (noOfDaysDue > days) return sum + 0;
      return sum + item.totalGross;
    }, 0);
  };

  const findOverdueByDaysInvoices = (days, invoices) => {
    return invoices.reduce((sum, item) => {
      const noOfDaysDue = moment().diff(item.dueToDate, "days");
      if (noOfDaysDue > days) return sum + 0;
      return sum + item.outstandingAmount;
    }, 0);
  };

  const invoicesTabList = [
    { label: "Invoices", content: <DashBoardInvoiceTab /> },
    { label: "Expenses", content: <DashboardExpenseTab /> },
  ];
  const quotationTabList = [
    { label: "Quotation", content: <DashboardQuotation /> },
  ];

  const salesTabList = [
    { label: "Sales By Article", content: <DashboardSalesByArticle /> },
    { label: "Sales By Customer", content: <DashboardSalesByCustomer /> },
  ];

  const expenseTabList = [
    { label: "Expense By Article", content: <DashboardExpenseByArticle /> },
    { label: "Expense By Payee", content: <DashboardExpenseByPayee /> },
  ];

  return (
    <PageContent
      breadCrumbIcon={
        <FeatherIcon
          color="#272D30"
          name="Activity"
          size={18}
          style={{ marginRight: "10px" }}
        />
      }
      breadCrumbData={["Home", "Dashboard"]}
      title="Dashboard"
    >
      <div className="dashboard-wrapper">
        <div className="columns is-multiline" style={{ marginBottom: "20px" }}>
          <div className="column is-6">
            {receivablesCard.invoices.length > 0 ? (
              <DashBoardSummaryCard
                heading={"To Receive"}
                subHeading={" Receivables from unpaid invoices"}
                cardData={receivablesCard}
              />
            ) : (
              <AdvancedCard
                type={"s-card"}
                style={{
                  height: "143px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h2 style={{ fontSize: "18px" }}>
                  Create Inovices to Open Chart
                </h2>
                <Button
                  isRounded
                  className={"create-expense-btn"}
                  onClick={() => navigate("/sales/invoices")}
                >
                  Create Invoices
                </Button>
              </AdvancedCard>
            )}
          </div>
          <div className={"column is-6"}>
            {payableCard.expenses.length > 0 ? (
              <DashBoardSummaryCard
                heading={"To Pay"}
                subHeading={"Unpaid bill amount"}
                cardData={payableCard}
              />
            ) : (
              <AdvancedCard
                type={"s-card"}
                style={{
                  height: "143px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h2 style={{ fontSize: "18px" }}>
                  Create Expenses to Open Chart
                </h2>
                <Button
                  isRounded
                  className={"create-expense-btn"}
                  onClick={() => navigate("/accounting/expense")}
                >
                  Create Expenses
                </Button>
              </AdvancedCard>
            )}
          </div>
        </div>

        <div className="columns is-mulitline">
          <div className="column is-6 dashboard-invoice-expense-card">
            <AdvancedCard type={"s-card"} style={{ minHeight: "582px" }}>
              <Tabs tabList={invoicesTabList} />
            </AdvancedCard>
          </div>
          <div className="column is-6 quotation-card">
            <AdvancedCard type={"s-card"} style={{ minHeight: "582px" }}>
              <Tabs tabList={quotationTabList} />
            </AdvancedCard>
          </div>
        </div>

        <DashboardSalesExpenseStats />

        <div className="columns is-mulitline">
          <div className="column is-6 sale-tabs">
            <AdvancedCard type={"s-card"} style={{ minHeight: "582px" }}>
              <Tabs tabList={salesTabList} />
            </AdvancedCard>
          </div>
          <div className="column is-6 expense-tabs">
            <AdvancedCard type={"s-card"} style={{ minHeight: "582px" }}>
              <Tabs tabList={expenseTabList} />
            </AdvancedCard>
          </div>
        </div>
      </div>
    </PageContent>
  );
};

export default Dashboard;

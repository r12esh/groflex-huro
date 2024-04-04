import moment from "moment";
import React, { useEffect, useState } from "react";

import groflexService from "../../services/groflex.service";
import config from "../../../../newConfig";
import DashboardChartCard from "./DashboardChartCard";

const DashboardExpenseTab = () => {
  const [date, setDate] = useState({
    startDate: "",
    endDate: "",
  });
  const [totalValue, setTotalValue] = useState({});

  const [expense, setExpenses] = useState([]);

  const [series, setSeries] = useState({
    paid: { count: 0, amount: 0 },
    cancelled: { count: 0, amount: 0 },
    open: { count: 0, amount: 0 },
  });

  const fetchExpenses = () => {
    groflexService
      .request(
        `${config.resourceUrls.expenseChartData(date.startDate, date.endDate)}`,
        { auth: true, method: "GET" }
      )
      .then((res) => {
        let total = 0;
        let paid = {
          count: 0,
          amount: 0,
        };
        let cancelled = {
          count: 0,
          amount: 0,
        };
        let open = {
          count: 0,
          amount: 0,
        };
        setExpenses(res.body.data);
        res.body.data.forEach((item) => {
          if (item.status === "paid" || item.status === "open") {
            total += item.totalGross;
          }
          if (item.status === "paid") {
            // paid += item.totalGross;
            paid.count = paid.count + 1;
            paid.amount += item.totalGross;
          }
          if (item.status === "cancelled") {
            // canceled += item.totalGross;
            cancelled.count = cancelled.count + 1;
            cancelled.amount += item.totalGross;
          }
          if (item.status === "open") {
            open.count = open.count + 1;
            open.amount += item.totalGross;
          }
        });
        setTotalValue({
          label: "Total Expenditure",
          value: parseFloat(total).toFixed(0),
        });

        setSeries({
          paid: paid,
          cancelled: cancelled,
          open: open,
        });
      });
  };

  useEffect(() => {
    if (date.startDate && date.endDate) {
      fetchExpenses();
    }
  }, [date]);

  const [isBarChart, setIsBarChart] = useState(true);

  const chartData = {
    labels: ["Open", "Paid", "Canceled"],

    datasets: [
      {
        label: "",
        data: [series.open.amount, series.paid.amount, series.cancelled.amount],
        backgroundColor: [
          "rgb(239, 71, 111)",
          "rgb(255, 209, 102)",
          "rgb(17, 138, 178)",
        ],
      },
    ],
  };

  const chartOptions = isBarChart
    ? {
        barThickness: 40,
        plugins: {
          legend: {
            display: false,
          },
        },
      }
    : {
        radius: "60%",
        spacing: 7,
        plugins: {
          legend: {
            display: false,
          },
        },
      };

  return (
    <DashboardChartCard
      linkToNavigate="/accounting/expenses"
      createButtonTitle="Create expense"
      dataLength={expense.length}
      pieChartSummary={totalValue}
      className={"dashboard-invoice-expense-tab-wrapper"}
      headerClassName={"invoice-tab-header"}
      chartData={chartData}
      chartOptions={chartOptions}
      chartId={"expense"}
      chartType={isBarChart}
      setChartType={setIsBarChart}
      chartEntries={[
        {
          label: "Open",
          value: series.open.amount,
          count: series.open.count,
          color: "rgb(239, 71, 111)",
        },
        {
          label: "Paid",
          value: series.paid.amount,
          count: series.paid.count,
          color: "rgb(255, 209, 102)",
        },

        {
          label: "Cancelled",
          value: series.cancelled.amount,
          count: series.cancelled.count,
          color: "rgb(17, 138, 178)",
        },
      ]}
      setDate={setDate}
      date={date}
    />
  );
};

export default DashboardExpenseTab;

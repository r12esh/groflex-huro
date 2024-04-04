import React, { useEffect, useState } from "react";

import groflexService from "../../services/groflex.service";
import config from "../../../../newConfig";
import DashboardChartCard from "./DashboardChartCard";

const DashBoardInvoiceTab = () => {
  const [date, setDate] = useState({
    startDate: "",
    endDate: "",
  });

  const [series, setSeries] = useState({
    paid: { count: 0, amount: 0 },
    canceled: { count: 0, amount: 0 },
    open: { count: 0, amount: 0 },
  });
  const [invoiceList, setInvoiceList] = useState([]);
  const [totalValue, setTotalValue] = useState({});

  const fetchInvoiceList = () => {
    groflexService
      .request(
        `${config.resourceUrls.invoiceChartData(date.startDate, date.endDate)}`,
        { auth: true, method: "GET" }
      )
      .then((res) => {
        let total = 0;

        let paid = {
          count: 0,
          amount: 0,
        };
        let canceled = {
          count: 0,
          amount: 0,
        };
        let open = {
          count: 0,
          amount: 0,
        };

        setInvoiceList(res.body.data);
        res.body.data.forEach((item) => {
          if (item.state === "paid" || item.state === "locked") {
            total += item.totalGross;
          }
          if (item.state === "paid") {
            // paid += item.totalGross;
            paid.count = paid.count + 1;
            paid.amount += item.totalGross;
          }
          if (item.state === "locked") {
            // open += item.totalGross;
            open.count = open.count + 1;
            open.amount += item.totalGross;
          }
          if (item.state === "cancelled") {
            // canceled += item.totalGross;
            canceled.count = canceled.count + 1;
            canceled.amount += item.totalGross;
          }
        });
        setSeries({
          paid: paid,
          open: open,
          canceled: canceled,
        });

        setTotalValue({
          label: "Total Sales",
          value: parseFloat(total).toFixed(0),
        });
      });
  };
  useEffect(() => {
    if (date.startDate && date.endDate) {
      fetchInvoiceList();
    }
  }, [date]);

  const [isBarChart, setIsBarChart] = useState(true);

  const chartData = {
    labels: ["Paid", "Canceled", "Open"],

    datasets: [
      {
        label: "",
        data: [series.paid.amount, series.canceled.amount, series.open.amount],
        backgroundColor: [
          "rgb(255, 209, 102)",
          "rgb(17, 138, 178)",
          "rgb(239, 71, 111)",
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
      linkToNavigate="/sales/invoices"
      createButtonTitle="Create Invoices"
      dataLength={invoiceList.length}
      date={date}
      pieChartSummary={totalValue}
      className={"dashboard-invoice-expense-tab-wrapper"}
      headerClassName={"invoice-tab-header"}
      chartData={chartData}
      chartOptions={chartOptions}
      chartId={"invoice"}
      chartType={isBarChart}
      setChartType={setIsBarChart}
      chartEntries={[
        {
          label: "Paid",
          value: series.paid.amount,
          count: series.paid.count,
          color: "rgb(255, 209, 102)",
        },
        {
          label: "Cancelled",
          value: series.canceled.amount,
          count: series.canceled.count,
          color: "rgb(17, 138, 178)",
        },
        {
          label: "Open",
          value: series.open.amount,
          count: series.open.count,
          color: "rgb(239, 71, 111)",
        },
      ]}
      setDate={setDate}
    />
  );
};

export default DashBoardInvoiceTab;

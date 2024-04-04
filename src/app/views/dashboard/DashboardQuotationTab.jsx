import React, { useEffect, useState } from "react";

import config from "../../../../newConfig";
import groflexService from "../../services/groflex.service";
import DashboardChartCard from "./DashboardChartCard";

const DashboardQuotation = () => {
  const [date, setDate] = useState({
    startDate: "",
    endDate: "",
  });
  const [totalValue, setTotalValue] = useState({});

  const [quotations, setQuotations] = useState([]);

  const [series, setSeries] = useState({
    invoiced: { count: 0, amount: 0 },
    accepted: { count: 0, amount: 0 },
    open: { count: 0, amount: 0 },
  });

  const fetchQuotations = () => {
    groflexService
      .request(
        `${config.resourceUrls.quotationChartData(
          date.startDate,
          date.endDate
        )}`,
        { auth: true, method: "GET" }
      )
      .then((res) => {
        let total = 0;
        let invoiced = {
          count: 0,
          amount: 0,
        };
        let accepted = {
          count: 0,
          amount: 0,
        };
        let open = {
          count: 0,
          amount: 0,
        };

        setQuotations(res.body.data);
        res.body.data.forEach((item) => {
          if (
            item.state === "invoiced" ||
            item.state === "accepted" ||
            item.state === "open"
          ) {
            total += item.totalGross;
          }
          if (item.state === "invoiced") {
            invoiced.count = invoiced.count + 1;
            invoiced.amount += item.totalGross;
          }
          if (item.state === "accepted") {
            // canceled += item.totalGross;
            accepted.count = accepted.count + 1;
            accepted.amount += item.totalGross;
          }
          if (item.state === "open") {
            // canceled += item.totalGross;
            open.count = open.count + 1;
            open.amount += item.totalGross;
          }
        });
        setTotalValue({
          label: "Quotations",
          value: parseFloat(total).toFixed(0),
        });

        setSeries({
          invoiced: invoiced,
          accepted: accepted,
          open: open,
        });
      });
  };

  useEffect(() => {
    if (date.startDate && date.endDate) {
      fetchQuotations();
    }
  }, [date]);

  const [isBarChart, setIsBarChart] = useState(true);

  const chartData = {
    labels: ["Invoiced", "Accepted", "Open"],

    datasets: [
      {
        label: "",
        data: [
          series.invoiced.amount,
          series.accepted.amount,
          series.open.amount,
        ],
        backgroundColor: [
          "rgb(255, 209, 102)",
          "rgb(6, 214, 160)",
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
      createButtonTitle="Create Quotations"
      linkToNavigate="/sales/quotations"
      dataLength={quotations.length}
      pieChartSummary={totalValue}
      className={"dashboard-quotation-tab-wrapper"}
      headerClassName={"quotation-tab-header"}
      chartData={chartData}
      chartOptions={chartOptions}
      chartId={"quotation"}
      chartType={isBarChart}
      setChartType={setIsBarChart}
      chartEntries={[
        {
          label: "Invoiced",
          value: series.invoiced.amount,
          count: series.invoiced.count,
          color: "rgb(255, 209, 102)",
        },
        {
          label: "Accepted",
          value: series.accepted.amount,
          count: series.accepted.count,
          color: "rgb(6, 214, 160)",
        },
        {
          label: "Open",
          value: series.open.amount,
          count: series.open.count,
          color: "rgb(239, 71, 111)",
        },
      ]}
      setDate={setDate}
      date={date}
    />
  );
};

export default DashboardQuotation;

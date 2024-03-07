import moment from "moment";
import React, { useEffect, useState } from "react";

import DashboardChartCard from "./DashboardChartCard";
import groflexService from "../../services/groflex.service";
import config from "../../../../newConfig";
const colors = [
  "rgb(251, 195, 177)",
  "rgb(247, 140, 107)",
  "rgb(245, 104, 61)",
  "rgb(233, 64, 12)",
  "rgb(194, 53, 10)",
];
const DashboardExpenseByPayee = () => {
  const [date, setDate] = useState({
    startDate: "",
    endDate: "",
  });
  const [isBarChart, setIsBarChart] = useState(true);
  const [filter, setFilter] = useState("filterByName");
  const [response, setResponse] = useState(null);
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([]);
  const [entries, setEntries] = useState([]);
  const [totalValue, setTotalValue] = useState({
    label: "",
    value: 0,
  });

  const fetchExpenseBy = () => {
    groflexService
      .request(
        `${config.resourceUrls.expenseBy(date.startDate, date.endDate)}`,
        {
          auth: true,
        }
      )
      .then((res) => {
        setResponse(res.body.data);
      });
  };

  useEffect(() => {
    if (date.startDate && date.endDate) {
      fetchExpenseBy();
    }
  }, [date]);

  useEffect(() => {
    if (response) {
      createChartData(filter);
    }
  }, [response]);

  const handleFilterChange = (option) => {
    setFilter(option.value);
    createChartData(option.value);
  };

  const createChartData = (value) => {
    let labels = [];
    let series = [];
    let entries = [];
    let total = 0;

    if (value === "filterByName") {
      response.expensesByPayee.forEach((payee, id) => {
        total += payee.totalGross;
        labels.push(payee.customerData.name);
        series.push(payee.totalGross);

        entries.push({
          label: payee.customerData.name,
          value: payee.totalGross,
          color: colors[id],
        });
      });
      setTotalValue({
        label: "Total Expense",
        value: parseFloat(total).toFixed(0),
      });
      setLabels(labels);
      setSeries(series);
      setEntries(entries);
    }

    if (value === "filterByCategory") {
      response.expensesByPayee.forEach((item, id) => {
        total += item.totalGross;
        if (!labels.includes(item.category)) {
          labels.push(item.category);
          series.push(0);
        }
      });

      response.expensesByPayee.forEach((item) => {
        if (labels.includes(item.category)) {
          const index = labels.findIndex((val) => {
            return val === item.category;
          });

          series[index] = series[index] + item.totalGross;
        }
      });

      labels.forEach((item, id) => {
        entries.push({
          label: item,
          value: series[id],
          color: colors[id],
        });
      });
      setTotalValue({
        label: "Total Expense",
        value: parseFloat(total).toFixed(0),
      });

      setLabels(labels);
      setSeries(series);
      setEntries(entries);
    }
  };

  const breakString = (str) => {
    const words = str.split(" ");
    let lines = [];
    let currentLine = "";

    words.forEach((word) => {
      if (currentLine.length + word.length <= 15) {
        // Adjust the character limit per line as needed
        currentLine += word + " ";
      } else {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      }
    });

    if (currentLine.trim() !== "") {
      lines.push(currentLine.trim());
    }

    return lines;
  };

  const chartData = {
    labels: labels,

    datasets: [
      {
        label: "",
        data: series,
        backgroundColor: colors,
      },
    ],
  };

  const chartOptions = isBarChart
    ? {
        scales: {
          x: {
            ticks: {
              callback(val, index) {
                // Hide the label of every 2nd dataset

                return breakString(this.getLabelForValue(val));
              },
            },
          },
        },
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
  const filterOptions = [
    {
      label: "Filter By Category",
      value: "filterByCategory",
    },
    {
      label: "Filter By Name",
      value: "filterByName",
    },
  ];
  return (
    <DashboardChartCard
      pieChartSummary={totalValue}
      className={"dashboard-expense-by-tab-wrapper"}
      headerClassName={"expense-by-tab-header"}
      chartData={chartData}
      chartOptions={chartOptions}
      chartId={"expenseByPayee"}
      chartType={isBarChart}
      setChartType={setIsBarChart}
      chartEntries={entries}
      setDate={setDate}
      filterOptions={filterOptions}
      handleFilterChange={handleFilterChange}
      filter={filter}
      date={date}
    />
  );
};

export default DashboardExpenseByPayee;

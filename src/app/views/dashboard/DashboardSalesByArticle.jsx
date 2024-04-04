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
const DashboardSalesByArticle = () => {
  const [date, setDate] = useState({
    startDate: "",
    endDate: "",
  });
  const [totalvalue, setTotalValue] = useState({ label: "Total", value: 0 });
  const [isBarChart, setIsBarChart] = useState(true);
  const [filter, setFilter] = useState("filterByName");
  const [response, setResponse] = useState(null);
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([]);
  const [entries, setEntries] = useState([]);

  const fetchSalesByArticles = () => {
    groflexService
      .request(
        `${config.resourceUrls.salesByArticles(date.startDate, date.endDate)}`,
        { auth: true }
      )
      .then((res) => {
        setResponse(res.body.data);
      });
  };

  useEffect(() => {
    if (date.startDate && date.endDate) {
      fetchSalesByArticles();
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
    let total = 0;
    let labels = [];
    let series = [];
    let entries = [];

    // if (response && response?.articles) {
    if (value === "filterByName") {
      response.articles.custom.forEach((article, id) => {
        total += article.value;
        labels.push(article.name);
        series.push(article.value);
        // series.push(article.value);
        entries.push({
          label: article.name,
          value: article.value,
          color: colors[id],
        });
      });
    }

    if (value === "filterByCategory") {
      response.articleCategories.custom.forEach((category, id) => {
        total += category.value;
        labels.push(category.name);
        series.push(category.value);
        entries.push({
          label: category.name,
          value: category.value,
          color: colors[id],
        });
      });
    }
    // }
    setTotalValue({
      label: "Total Sales",
      value: parseFloat(total).toFixed(0),
    });

    setLabels(labels);
    setSeries(series);
    setEntries(entries);
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
      createButtonTitle="Create Invoice"
      linkToNavigate="/sales/invoices"
      dataLength={series.length}
      pieChartSummary={totalvalue}
      className={"dashboard-sales-by-article-tab-wrapper"}
      headerClassName={"sales-by-article-tab-header"}
      chartData={chartData}
      chartOptions={chartOptions}
      chartId={"salesByArticle"}
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

export default DashboardSalesByArticle;

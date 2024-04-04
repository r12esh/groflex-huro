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
const DashboardSalesByCustomer = () => {
  const [date, setDate] = useState({
    startDate: "",
    endDate: "",
  });
  const [totalValue, setToalValue] = useState({
    label: "",
    value: 0,
  });
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
    let labels = [];
    let series = [];
    let entries = [];
    let total = 0;

    // if (response && response?.articles) {
    if (value === "filterByName") {
      response.customers.custom.forEach((customer, id) => {
        total += customer.value;
        labels.push(customer.name);
        series.push(customer.value);

        entries.push({
          label: customer.name,
          value: customer.value,
          color: colors[id],
        });
      });
    }

    if (value === "filterByCategory") {
      response.customerCategories.custom.forEach((category, id) => {
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

    setToalValue({
      label: "Total Sales",
      value: parseFloat(total).toFixed(0),
    });
    setLabels(labels);
    setSeries(series);
    setEntries(entries);
  };

  // const chartData = {
  //   labels: labels,
  //   series: chartType ? [series] : series,
  // };
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
      pieChartSummary={totalValue}
      className={"dashboard-sales-by-article-tab-wrapper"}
      headerClassName={"sales-by-article-tab-header"}
      chartData={chartData}
      chartOptions={chartOptions}
      chartId={"salesByCustomer"}
      chartType={isBarChart}
      setChartType={setIsBarChart}
      chartEntries={entries}
      setDate={setDate}
      filterOptions={filterOptions}
      handleFilterChange={handleFilterChange}
      filter={filter}
      date={date}
    />
    // <div className="dashboard-invoice-tab-wrapper">
    //   <div className="columns is-multiline invoice-tab-header">
    //     <div className="column is-6">
    //       <SelectInput
    //         options={dateOptions}
    //         placeholder={"None"}
    //         onChange={handleDateDropDown}
    //         value={date}
    //       />
    //     </div>
    //     <div
    //       className="column is-1 toggle-chart-btn"
    //       onClick={() => setChartType(!chartType)}
    //     >
    //       <FeatherIcon
    //         name={chartType ? "PieChart" : "BarChart"}
    //         size={20}
    //         color="rgb(17, 138, 178)"
    //       />
    //     </div>
    //   </div>

    //   <div className="column is-12 donut-chart-wrapper"></div>
    //   <div className="columns is-multiline value-categories">
    //     <div className="column is-6">
    //       <span
    //         className="value-category-dot"
    //         style={{ backgroundColor: "rgb(251, 195, 177)" }}
    //       ></span>
    //       <div>
    //         {" "}
    //         <p className="value-category-text">
    //           Demo {`(2)`}{" "}
    //           <FeatherIcon
    //             name={"ArrowUpRight"}
    //             size={20}
    //             color="rgb(17, 138, 178)"
    //           />
    //         </p>
    //         <p className="value-category-value">
    //           ₹ 84 <span>{"| "} 100 %</span>
    //         </p>
    //       </div>
    //     </div>
    //     <div className="column is-6">
    //       <span
    //         className="value-category-dot"
    //         style={{ backgroundColor: "rgb(247, 140, 107" }}
    //       ></span>
    //       <div>
    //         {" "}
    //         <p className="value-category-text">
    //           Test {`(2)`}{" "}
    //           <FeatherIcon
    //             name={"ArrowUpRight"}
    //             size={20}
    //             color="rgb(17, 138, 178)"
    //           />
    //         </p>
    //         <p className="value-category-value">
    //           ₹ 84 <span>{"| "} 100 %</span>
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default DashboardSalesByCustomer;

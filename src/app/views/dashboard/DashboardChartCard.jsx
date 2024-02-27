import React, { useState } from "react";
import { SelectInput } from "../../shared/components/select/SelectInput";
import { FeatherIcon } from "../../shared/featherIcon/FeatherIcon";

import moment from "moment";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import CreateChart from "../../shared/components/chartjs/CreateChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
const dateFilterTypes = {
  fiscalYear: "Fiscal Year",
  currentMonth: moment().format("MMMM"),
  lastMonth: moment().subtract(1, "months").format("MMMM"),
  secondLastMonth: moment().subtract(2, "months").format("MMMM"),
  currentQuarter: moment().startOf("quarter").format("Q/YYYY"),
  lastQuarter: moment()
    .subtract(3, "months")
    .startOf("quarter")
    .format("Q/YYYY"),
  secondLastQuarter: moment()
    .subtract(6, "months")
    .startOf("quarter")
    .format("Q/YYYY"),
};
const DashboardChartCard = ({
  className,
  chartData,
  chartOptions,
  chartId,
  headerClassName,
  chartEntries = [],
  chartType,
  setChartType,
  setDate,
  filterOptions,
  handleFilterChange,
  filter,
  pieChartSummary = {
    label: "",
    value: 0,
  },
}) => {
  const [dateDropDown, setDateDropDown] = useState({
    label: dateFilterTypes.fiscalYear,
    value: "fiscalYear",
  });

  const handleDateDropDown = (option) => {
    // setDate(option.value);
    setDateDropDown(option.value);
    let startDate = "";
    let endDate = "";
    switch (option.value) {
      case "currMonth":
        startDate = moment().startOf("month");
        endDate = moment().endOf("month");

        break;
      case "lastMonth":
        startDate = moment().subtract(1, "months").startOf("month");
        endDate = moment().subtract(1, "months").endOf("month");
        break;
      case "secondLastMonth":
        startDate = moment().subtract(2, "months").startOf("month");
        endDate = moment().subtract(2, "months").endOf("month");
        break;
      case "currQuarter":
        startDate = moment().startOf("quarter");
        endDate = moment().endOf("quarter");
        break;
      case "lastQuarter":
        startDate = moment().subtract(3, "months").startOf("quarter");
        endDate = moment()
          .subtract(3, "months")
          .endOf("quarter")
          .format("DD MMMM YYYY");
        break;
      case "secondLastQuarter":
        startDate = moment().subtract(6, "months").startOf("quarter");
        endDate = moment().subtract(6, "months").endOf("quarter");
        break;
      case "fiscalYear":
        const financialYearMonthStart = moment()
          .utc()
          .set("month", 2)
          .set("date", 31);
        startDate =
          financialYearMonthStart < moment().utc()
            ? financialYearMonthStart
            : financialYearMonthStart.set("year", moment().utc().year() - 1);
        endDate = endDate ? moment(endDate).utc() : moment().utc();
        break;
    }

    setDate({
      startDate: startDate.toJSON(),
      endDate: endDate.toJSON(),
    });
  };

  const dateOptions = [
    {
      label: dateFilterTypes.currentMonth,
      value: "currMonth",
    },
    {
      label: dateFilterTypes.lastMonth,
      value: "lastMonth",
    },
    {
      label: dateFilterTypes.secondLastMonth,
      value: "secondLastMonth",
    },
    {
      label: `Quarter ${dateFilterTypes.currentQuarter}`,
      value: "currQuarter",
    },
    {
      label: `Quarter ${dateFilterTypes.lastQuarter}`,
      value: "lastQuarter",
    },
    {
      label: `Quarter ${dateFilterTypes.secondLastQuarter}`,
      value: "secondLastQuarter",
    },
    {
      label: dateFilterTypes.fiscalYear,
      value: "fiscalYear",
    },
  ];

  return (
    <div className={className}>
      <div
        className={`${headerClassName}`}
        style={{ display: "flex", marginBottom: "30px" }}
      >
        <div style={{ width: "168px" }}>
          <SelectInput
            options={dateOptions}
            placeholder={"None"}
            onChange={handleDateDropDown}
            value={dateDropDown}
            defaultValue={"fiscalYear"}
          />
        </div>
        <div
          className="toggle-chart-btn"
          onClick={() => setChartType(!chartType)}
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FeatherIcon
            name={chartType ? "PieChart" : "BarChart"}
            size={25}
            color="rgb(17, 138, 178)"
          />
        </div>
      </div>
      {filter && (
        <div className="columns is-multiline">
          <div style={{ width: "168px", marginLeft: "10px" }}>
            <SelectInput
              options={filterOptions}
              placeholder={"None"}
              onChange={handleFilterChange}
              value={filter}
              defaultValue={"filterByName"}
            />
          </div>
        </div>
      )}

      <div className="column is-12 donut-chart-wrapper">
        {chartType === false && (
          <div className="pie-chart-label-container">
            <div className="container-text">{pieChartSummary.label}</div>
            <div className="contianer-value">₹ {pieChartSummary.value}</div>
          </div>
        )}

        {chartData.datasets.length > 0 && (
          <CreateChart
            chartData={chartData}
            chartOptions={chartOptions}
            chartType={chartType ? "barChart" : "doughnutChart"}
          />
        )}
      </div>
      <div className="columns is-multiline value-categories">
        {chartEntries.map((entry, id) => (
          <div className="column is-6" key={`category-${id}`}>
            <span
              className="value-category-dot"
              style={{ backgroundColor: entry.color }}
            ></span>
            <div>
              {" "}
              <p className="value-category-text">
                {`${entry.label} ${entry.count ? `(${entry.count})` : ""}`}
                <FeatherIcon
                  name={"ArrowUpRight"}
                  size={20}
                  color="rgb(17, 138, 178)"
                />
              </p>
              <p className="value-category-value">
                ₹ {parseFloat(entry.value).toFixed(0)} <span>{"| "} 100 %</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardChartCard;

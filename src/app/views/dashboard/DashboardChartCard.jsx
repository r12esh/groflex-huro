import React, { useEffect, useState } from "react";
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
import DateInput from "../../shared/components/datePicker/DateInput";
import { formatCurrency } from "../../helpers/formatCurrency";
import { AdvancedCard } from "../../shared/components/cards/AdvancedCard";
import { Button } from "../../shared/components/button/Button";
import { useNavigate } from "react-router-dom";

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
  date,
  setDate,
  filterOptions,
  handleFilterChange,
  filter,
  pieChartSummary = {
    label: "",
    value: 0,
  },
  dataLength = 0,
  createButtonTitle = "",
  linkToNavigate = "",
}) => {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState("fiscalYear");
  const [showCustomDateRangeSelector, setShowCustomDateRangeSelector] =
    useState(false);

  useEffect(() => {
    handleDateChange();
  }, [dateFilter]);

  const handleDateFilterChange = (option) => {
    setDateFilter(option.value);
  };

  const handleDateChange = () => {
    let startDate = "";
    let endDate = "";
    switch (dateFilter) {
      case "currMonth":
        setShowCustomDateRangeSelector(false);
        startDate = moment().startOf("month");
        endDate = moment().endOf("month");

        break;
      case "lastMonth":
        setShowCustomDateRangeSelector(false);
        startDate = moment().subtract(1, "months").startOf("month");
        endDate = moment().subtract(1, "months").endOf("month");
        break;
      case "secondLastMonth":
        setShowCustomDateRangeSelector(false);
        startDate = moment().subtract(2, "months").startOf("month");
        endDate = moment().subtract(2, "months").endOf("month");
        break;
      case "currQuarter":
        setShowCustomDateRangeSelector(false);
        startDate = moment().startOf("quarter");
        endDate = moment().endOf("quarter");
        break;
      case "lastQuarter":
        setShowCustomDateRangeSelector(false);
        startDate = moment().subtract(3, "months").startOf("quarter");
        endDate = moment()
          .subtract(3, "months")
          .endOf("quarter")
          .format("DD MMMM YYYY");
        break;
      case "secondLastQuarter":
        setShowCustomDateRangeSelector(false);
        startDate = moment().subtract(6, "months").startOf("quarter");
        endDate = moment().subtract(6, "months").endOf("quarter");
        break;
      case "fiscalYear":
        setShowCustomDateRangeSelector(false);
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
      case "custom":
        setShowCustomDateRangeSelector(true);
        break;
    }

    if (dateFilter !== "custom") {
      setDate({
        startDate: startDate.toJSON(),
        endDate: endDate.toJSON(),
      });
    }
  };

  const handleCustomStartDateChange = (value) => {
    setDate({
      ...date,
      startDate: value.toJSON(),
    });
  };
  const handleCustomEndDateChange = (value) => {
    setDate({
      ...date,
      endDate: value.toJSON(),
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
    {
      label: "Custom",
      value: "custom",
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
            onChange={handleDateFilterChange}
            value={dateFilter}
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
      {showCustomDateRangeSelector && (
        <div className="columns is-multiline" style={{ marginTop: "10px" }}>
          <div className="column is-6">
            <DateInput
              selectedDate={moment(date.startDate)}
              onDateChange={handleCustomStartDateChange}
            />
          </div>
          <div className="column is-6">
            <DateInput
              selectedDate={moment(date.endDate)}
              onDateChange={handleCustomEndDateChange}
            />
          </div>
        </div>
      )}
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

      {dataLength > 0 ? (
        <>
          <div className="column is-12 donut-chart-wrapper">
            {chartType === false && (
              <div className="pie-chart-label-container">
                <div className="container-text">{pieChartSummary.label}</div>
                <div className="contianer-value">
                  {formatCurrency(pieChartSummary.value)}
                </div>
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
                    {formatCurrency(parseFloat(entry.value).toFixed(0))}{" "}
                    <span>{"| "} 100 %</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <AdvancedCard
          containerClassName={"dashboard-no-data-content"}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
          type={"s-card"}
        >
          <h2 style={{ fontSize: "16px", color: "#747474", fontWeight: "500" }}>
            No data available for the selected period
          </h2>
          <Button
            isRounded
            className={"create-expense-btn"}
            onClick={() => navigate(linkToNavigate)}
          >
            {createButtonTitle}
          </Button>
        </AdvancedCard>
      )}
    </div>
  );
};

export default DashboardChartCard;

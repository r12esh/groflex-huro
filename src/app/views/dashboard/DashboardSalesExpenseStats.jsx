import React, { useEffect, useState } from "react";
import { AdvancedCard } from "../../shared/components/cards/AdvancedCard";
import { SelectInput } from "../../shared/components/select/SelectInput";
import moment from "moment";

import groflexService from "../../services/groflex.service";
import config from "../../../../newConfig";
import CreateChart from "../../shared/components/chartjs/CreateChart";

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
const DashboardSalesExpenseStats = () => {
  const [date, setDate] = useState({
    startDate: "",
    endDate: "",
  });

  const [salesExpenses, setSalesExpenses] = useState([]);
  const [totalValues, setTotalValues] = useState({
    totalSales: 0,
    totalExpenses: 0,
  });

  const [dateDropDown, setDateDropDown] = useState({
    label: dateFilterTypes.fiscalYear,
    value: "fiscalYear",
  });

  const [series, setSeries] = useState({
    sales: [],
    expenses: [],
  });
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    groflexService
      .request(
        `${config.resourceUrls.salesExpensesChartData(
          date.startDate,
          date.endDate
        )}`,
        { auth: true }
      )
      .then((res) => {
        let totalSales = 0;
        let totalExpenses = 0;
        let sales = [];
        let expenses = [];
        res.body.data.expensesMonthly.forEach((item) => {
          totalExpenses += item.value;
          expenses.push(item.value);
        });
        res.body.data.turnoverMonthly.forEach((item) => {
          totalSales += item.value;
          sales.push(item.value);
        });

        setTotalValues({
          totalSales: totalSales,
          totalExpenses: totalExpenses,
        });

        setSeries({
          sales: sales,
          expenses: expenses,
        });
      });
  }, [date]);

  const handleDateDropDown = (option) => {
    // setDate(option.value);
    setDateDropDown(option.value);
    let startDate = "";
    let endDate = "";
    let labels = [];
    switch (option.value) {
      case "currMonth":
        startDate = moment().startOf("month");
        endDate = moment().endOf("month");
        labels = [dateFilterTypes.currentMonth];
        break;
      case "lastMonth":
        startDate = moment().subtract(1, "months").startOf("month");
        endDate = moment().subtract(1, "months").endOf("month");
        labels = [dateFilterTypes.lastMonth];
        break;
      case "secondLastMonth":
        startDate = moment().subtract(2, "months").startOf("month");
        endDate = moment().subtract(2, "months").endOf("month");
        labels = [dateFilterTypes.secondLastMonth];
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
        labels = [
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
          "Jan",
          "Feb",
        ];
        break;
    }

    setLabels(labels);

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

  // const chartData = {
  //   labels: labels,
  //   series: [series.sales, series.expenses],
  // };
  const chartData = {
    labels: labels,

    datasets: [
      {
        label: "",
        data: series.sales,
        backgroundColor: ["rgb(0, 163, 83)"],
      },
      {
        label: "",
        data: series.expenses,
        backgroundColor: ["rgb(0, 113, 202)"],
      },
    ],
  };

  const chartOptions = {
    barThickness: 40,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="dashboard-sales-expense-stats-wrapper columns is-multiline">
      <div className="column is-12">
        <AdvancedCard type={"s-card"}>
          <h4
            className="dashboard-card-title"
            style={{ fontSize: "22px", marginBottom: "30px" }}
          >
            Sales and expenses statistics
          </h4>
          <div className="columns is-mulitline">
            <div className="column is-3">
              <SelectInput
                options={dateOptions}
                placeholder={"None"}
                onChange={handleDateDropDown}
                value={dateDropDown}
              />
            </div>
            <div
              className="column is-9 columns"
              style={{ justifyContent: "flex-end" }}
            >
              <div className="column is-4">
                <AdvancedCard type={"s-card"} style={{ padding: "0" }}>
                  <div className="total-sales-label">Total Sales</div>
                  <div className="total-sales-value">
                    ₹ {parseFloat(totalValues.totalSales).toFixed(0)}
                  </div>
                </AdvancedCard>
              </div>
              <div className="column is-4">
                <AdvancedCard type={"s-card"} style={{ padding: "0" }}>
                  <div className="total-expense-label">Total Expenses</div>
                  <div className="total-expense-value">
                    ₹ {parseFloat(totalValues.totalExpenses).toFixed(0)}
                  </div>
                </AdvancedCard>
              </div>
            </div>
          </div>

          <div
            className="columns is-mulitline"
            style={{ justifyContent: "flex-end" }}
          >
            <div
              className="column is-2"
              style={{ display: "flex", alignItems: "center" }}
            >
              <span
                className="category-dot"
                style={{ backgroundColor: "rgb(0, 163, 83)" }}
              ></span>
              <span className="category-text">Sales</span>
            </div>
            <div
              className="column is-2"
              style={{ display: "flex", alignItems: "center" }}
            >
              <span
                className="category-dot"
                style={{ backgroundColor: "rgb(0, 113, 202)" }}
              ></span>
              <span className="category-text">Expense</span>
            </div>
          </div>

          <div className="column is-12 bar-chart-wrapper">
            {/* <CreateChart
              data={chartData}
              options={chartOptions}
              chartType={"barChart"}
              chartId={"sales-expense"}
            /> */}
            <CreateChart
              chartData={chartData}
              chartOptions={chartOptions}
              chartType={"barChart"}
            />
          </div>
        </AdvancedCard>
      </div>
    </div>
  );
};

export default DashboardSalesExpenseStats;

import React, { useEffect, useState } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import Accordion from "../../../shared/components/accordion/Accordion";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";
import groflexService from "../../../services/groflex.service";
import config from "../../../../../newConfig";
import { SelectInput } from "../../../shared/components/select/SelectInput";
import moment from "moment";
import { Button } from "../../../shared/components/button/Button";
import { useSelector } from "react-redux";
import ReportsTable from "./ReportsTable";
import { DatePicker } from "@mui/x-date-pickers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateInput from "../../../shared/components/datePicker/DateInput";
import SendEmailModal from "../../../shared/components/sendEmail/SendEmailModal";
import { ButtonGroup } from "../../../shared/components/button/buttonGroup/ButtonGroup";
import ContextMenu from "../../../shared/components/contextMenu/ContextMenu";
import { formatCurrency } from "../../../helpers/formatCurrency";
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

const BalanceSheet = () => {
  const userName = "";
  const [date, setDate] = useState({
    startDate: "",
    endDate: "",
  });
  const [showCustomDateRangeSelector, setShowCustomDateRangeSelector] =
    useState(false);
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);

  const [dateFilter, setDateFilter] = useState("fiscalYear");

  const [rowData, setRowData] = useState([]);
  const [rowTotals, setRowTotals] = useState({});
  const [sendEmailFormData, setSendEmailFormData] = useState({
    emails: "",
    subject: "",
    message: "",
    pdf: false,
    csv: false,
  });

  useEffect(() => {
    handleDateChange();
  }, [dateFilter]);

  useEffect(() => {
    if (date.startDate && date.endDate) {
      fetchBalanceSheet();
    }
  }, [date]);

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
        endDate = moment().subtract(3, "months").endOf("quarter");

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

  const fetchBalanceSheet = () => {
    let tableHeaders = [];
    let rowData = [];
    let rowTotals = {};
    groflexService
      .request(
        `${config.resourceUrls.balanceSheet(
          date.startDate,
          date.endDate,
          "json"
        )}`,
        { auth: true }
      )
      .then((res) => {
        // console.log(res);
        if (res && res.body) {
          const transcations = res.body.data.summaryData.transactions;
          rowTotals = {
            AssetsTotal: [
              "",
              parseFloat(res.body.data.summaryData.assetsTotal).toFixed(2),
            ],
            EquityTotal: [
              "",
              parseFloat(res.body.data.summaryData.equityTotal).toFixed(2),
            ],
            ExpensesTotal: [
              "",
              parseFloat(res.body.data.summaryData.expensesTotal).toFixed(2),
            ],
            LiabilityTotal: [
              "",
              parseFloat(res.body.data.summaryData.liabilityTotal).toFixed(2),
            ],
            netValue: {
              label: "Total Balance",
              value: [
                "",
                parseFloat(res.body.data.summaryData.finalBalanceTotal).toFixed(
                  2
                ),
              ],
            },
          };

          transcations.forEach((transcation) => {
            if (!tableHeaders.includes(transcation.accountTypeId)) {
              tableHeaders.push(transcation.accountTypeId);
            }
          });
          transcations.forEach((item, index) => {
            let total =
              item.debits === 0
                ? parseFloat(item.credits).toFixed(2)
                : parseFloat(item.debits).toFixed(2);
            rowData.push({
              id: index + 1,
              groupColumn:
                item.accountTypeId.charAt(0).toUpperCase() +
                item.accountTypeId.slice(1),
              column1:
                item.accountSubTypeId
                  .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                  .charAt(0)
                  .toUpperCase() +
                item.accountSubTypeId
                  .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                  .slice(1),
              column2: formatCurrency(total),
            });
          });
          setRowTotals(rowTotals);
          setRowData(rowData);
        }
      });
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

  const handleSendEmail = () => {
    let sendType = "";
    if (sendEmailFormData.pdf && sendEmailFormData.csv) {
      sendType = "both";
    } else if (sendEmailFormData.pdf) {
      sendType = "pdf";
    } else if (sendEmailFormData.csv) {
      sendType = "both";
    }

    let payload = {
      recipients: [sendEmailFormData.emails],
      subject: sendEmailFormData.subject,
      text: sendEmailFormData.message,
      sendCopy: false,
      sendType: sendType,
    };
    groflexService
      .request(
        `${config.resourceUrls.sendAccountingReport(
          "BalanceSheet",
          date.startDate,
          date.endDate
        )}`,
        { auth: true, data: payload, method: "POST" }
      )
      .then((res) => {
        if (res.body?.message) {
          groflexService.toast.error("Something went wrong");
        } else {
          groflexService.toast.success(
            "Balance sheet has been sent successfully "
          );
        }
        setIsEmailModalVisible(false);
      });
  };

  const onExportButtonClick = (label) => {
    const exportType = label.toLowerCase();
    groflexService
      .request(
        `${config.resourceUrls.balanceSheet(
          date.startDate,
          date.endDate,
          exportType
        )}`,
        {
          auth: true,
          method: "GET",
          headers: { "Content-Type": `application/${exportType}` },
        }
      )
      .then(({ body }) => {
        var blob = new Blob([body], { type: "application/text" });

        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${moment(date.startDate).format()}_${moment(
          date.endDate
        ).format()}.${exportType}`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
      });
  };

  const handlePrint = () => {
    groflexService
      .request(
        `${config.resourceUrls.balanceSheet(
          date.startDate,
          date.endDate,
          "pdf"
        )}`,
        {
          auth: true,
          method: "GET",
          headers: { "Content-Type": `application/pdf` },
        }
      )
      .then(({ body }) => {
        if (body.size) {
          groflexService.toast.success(
            `Print initiated for BalanceSheet_${moment(date.startDate).format(
              "DD-MM-YYYY"
            )}_${moment(date.endDate).format("DD-MM-YYYY")} `
          );
        }
        var blob = new Blob([body], { type: "application/pdf" });

        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.target = "_blank";
        link.setAttribute("rel", "noopener noreferrer");

        link.click();
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
    <PageContent title={"Balance Sheet"}>
      <AdvancedCard
        type={"s-card"}
        style={{ padding: "0px" }}
        className={"balance-sheet-wrapper"}
      >
        <div className="columns is-multiline reports-header">
          <div className="column is-2">
            <SelectInput
              options={dateOptions}
              placeholder={"Select Date"}
              onChange={handleDateFilterChange}
              value={dateFilter}
            />
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

          <ButtonGroup>
            <Button
              icon={<i className={`fa-solid fa-envelope`}></i>}
              className={"utility-btn"}
              onClick={() => setIsEmailModalVisible(true)}
            >
              Send Email
            </Button>

            <ContextMenu
              classes={["button", "h-button"]}
              iconText={"Export"}
              contextMenuItems={[
                {
                  label: "PDF",
                  onContextMenuItemClick: (e) => onExportButtonClick(e),
                },
                {
                  label: "CSV",
                  onContextMenuItemClick: (e) => onExportButtonClick(e),
                },
              ]}
            />

            <Button
              icon={<i className="fa-solid fa-print"></i>}
              className={"utility-btn"}
              onClick={handlePrint}
            >
              Print
            </Button>
          </ButtonGroup>
        </div>

        {rowData.length > 0 ? (
          <div>
            <div className="reports-summary">
              <h3 style={{ fontSize: "25px", fontWeight: "500" }}>
                {userName} Balance Sheet
              </h3>
              <span style={{ color: "rgb(136, 135, 135)", fontWeight: "500" }}>
                From {moment(date.startDate).format("DD MMMM YYYY")} to{" "}
                {moment(date.endDate).format("DD MMMM YYYY")}
              </span>
            </div>

            <div className="balance-sheet-table">
              <ReportsTable
                rowData={rowData}
                tableHeaders={["| Account", "| Total"]}
                rowTotals={rowTotals}
              />
            </div>
          </div>
        ) : (
          <div className="reports-empty-table">No data to show</div>
        )}
      </AdvancedCard>
      <SendEmailModal
        isEmailModalVisible={isEmailModalVisible}
        setIsEmailModalVisible={setIsEmailModalVisible}
        handleSendEmail={handleSendEmail}
        sendEmailFormData={sendEmailFormData}
        setSendEmailFormData={setSendEmailFormData}
        fileName={`BalanceSheet_${moment(date.startDate).format(
          "DD-MM-YYYY"
        )}_${moment(date.endDate).format("DD-MM-YYYY")}`}
        title={"Send Balance Sheet"}
      />
    </PageContent>
  );
};

export default BalanceSheet;

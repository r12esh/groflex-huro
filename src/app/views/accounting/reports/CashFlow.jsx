import React, { useEffect, useState } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { useSelector } from "react-redux";
import moment from "moment";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import { SelectInput } from "../../../shared/components/select/SelectInput";
import { Button } from "../../../shared/components/button/Button";
import groflexService from "../../../services/groflex.service";
import config from "../../../../../newConfig";
import DateInput from "../../../shared/components/datePicker/DateInput";
import ContextMenu from "../../../shared/components/contextMenu/ContextMenu";
import { ButtonGroup } from "../../../shared/components/button/buttonGroup/ButtonGroup";
import SendEmailModal from "../../../shared/components/sendEmail/SendEmailModal";
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
const CashFlow = () => {
  const { companyAddress } = useSelector(
    (state) => state?.accountData?.tenantData || ""
  );
  const [date, setDate] = useState({
    startDate: "",
    endDate: "",
  });

  const [showCustomDateRangeSelector, setShowCustomDateRangeSelector] =
    useState(false);
  const [dateFilter, setDateFilter] = useState("fiscalYear");
  const [rowData, setRowData] = useState([]);
  const [totalValue, setTotalValue] = useState("");
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);

  const [tableHeaders, setTableHeaders] = useState([]);

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
      fetchCashFlowStatement();
    }
  }, [date]);

  const handleDateFilterChange = (option) => {
    setDateFilter(option.value);
  };

  const fetchCashFlowStatement = () => {
    let tableHeaders = [];
    let rowData = [];
    groflexService
      .request(
        `${config.resourceUrls.cashFlow(date.startDate, date.endDate, "json")}`,
        { auth: true }
      )
      .then((res) => {
        if (res && res.body) {
          setTotalValue(res.body.data.summaryData.finalCashFlowTotal);
          const transactions = res.body.data.summaryData.transactions;
          transactions.forEach((item) => {
            if (!tableHeaders.includes(item.accountTypeId)) {
              tableHeaders.push(item.accountTypeId);
            }
          });
          setTableHeaders(tableHeaders);
          setRowData(transactions);
        }
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
          "CashFlow",
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
            "Cash flow statement has been sent successfully"
          );
        }
        setIsEmailModalVisible(false);
      });
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

  const onExportButtonClick = (label) => {
    const exportType = label.toLowerCase();
    groflexService
      .request(
        `${config.resourceUrls.cashFlow(
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
    const exportType = "pdf";
    groflexService
      .request(
        `${config.resourceUrls.cashFlow(
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
        if (body.size) {
          groflexService.toast.success(
            `Print initiated for CashFlow_${moment(date.startDate).format(
              "DD-MM-YYYY"
            )}_${moment(date.endDate).format("DD-MM-YYYY")}`
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
    <PageContent title={"Cash and flow"}>
      <AdvancedCard
        type={"s-card"}
        style={{ padding: "0px" }}
        className={"cash-flow-wrapper"}
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
                {companyAddress?.companyName}
              </h3>
              <span style={{ color: "rgb(136, 135, 135)", fontWeight: "500" }}>
                From {moment(date.startDate).format("DD MMMM YYYY")} to{" "}
                {moment(date.endDate).format("DD MMMM YYYY")}
              </span>
            </div>

            <div className="cash-flow-table">
              <div className="reports-table">
                <table className="table  is-fullwidth">
                  <tbody>
                    <tr>
                      <th></th>
                      <th></th>
                    </tr>
                    {tableHeaders.map((heading, id) => (
                      <React.Fragment key={id}>
                        <tr style={{ height: "54px" }}>
                          <td colSpan={2} className="row-heading">
                            {heading
                              .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                              .charAt(0)
                              .toUpperCase() +
                              heading
                                .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                                .slice(1)}
                          </td>
                        </tr>
                        {rowData.map((row, id) => {
                          if (row.accountTypeId === heading) {
                            let total = parseFloat(row.total).toFixed(2);
                            return (
                              <tr style={{ height: "54px" }} key={id}>
                                <td>
                                  {row.accountSubTypeId
                                    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                                    .charAt(0)
                                    .toUpperCase() +
                                    row.accountSubTypeId
                                      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                                      .slice(1)}
                                </td>
                                <td className="row-data">
                                  {formatCurrency(total)}
                                </td>
                              </tr>
                            );
                          }
                        })}
                      </React.Fragment>
                    ))}
                    <tr
                      style={{
                        height: "54px",
                        fontSize: "15px",
                        fontWeight: "600",
                      }}
                    >
                      <td>TOTAL CASH IN FLOW</td>
                      <td
                        style={{
                          textAlign: "right",
                          color: "black",
                        }}
                      >
                        {formatCurrency(totalValue)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
        fileName={`CashFlow_${moment(date.startDate).format(
          "DD-MM-YYYY"
        )}_${moment(date.endDate).format("DD-MM-YYYY")}`}
        title={"Send cash flow statement"}
      />
    </PageContent>
  );
};

export default CashFlow;

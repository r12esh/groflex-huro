import React, { useEffect, useState } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import moment from "moment";
import { useSelector } from "react-redux";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import { SelectInput } from "../../../shared/components/select/SelectInput";
import { Button } from "../../../shared/components/button/Button";
import groflexService from "../../../services/groflex.service";
import config from "../../../../../newConfig";
import ReportsTable from "./ReportsTable";
import DateInput from "../../../shared/components/datePicker/DateInput";
import { ButtonGroup } from "../../../shared/components/button/buttonGroup/ButtonGroup";
import SendEmailModal from "../../../shared/components/sendEmail/SendEmailModal";
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
const GeneralLedger = () => {
  const { companyAddress } = useSelector(
    (state) => state?.accountData?.tenantData || ""
  );

  const [showCustomDateRangeSelector, setShowCustomDateRangeSelector] =
    useState(false);
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);

  const [customerDropDownValues, setCustomerDropDownValues] = useState([]);
  const [customerID, setCustomerID] = useState(
    customerDropDownValues[0]?.value
  );

  const [date, setDate] = useState({
    startDate: "",
    endDate: "",
  });
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
    if (customerID && date.startDate && date.endDate) {
      fetchGeneralLedger();
    }
  }, [date, customerID]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDateFilterChange = (option) => {
    setDateFilter(option.value);
  };
  const fetchCustomers = () => {
    let customerDropDown = [];
    groflexService
      .request(`${config.resourceUrls.generalLedgerCustomers}`, { auth: true })
      .then((res) => {
        res.body.data.forEach((item) => {
          customerDropDown.push({ label: item.name, value: item.id });
        });

        setCustomerDropDownValues(customerDropDown);
        setCustomerID(customerDropDown[0].value);
      });
  };

  const fetchGeneralLedger = () => {
    let rowData = [];

    groflexService
      .request(
        `${config.resourceUrls.generalLedger(
          date.startDate,
          date.endDate,
          "json",
          customerID
        )}`,
        { auth: true }
      )
      .then((res) => {
        let assetsTotal = {
          debitsTotal: 0,
          creditsTotal: 0,
          balanceTotal: 0,
        };
        let equityTotal = {
          debitsTotal: 0,
          creditsTotal: 0,
          balanceTotal: 0,
        };
        let expensesTotal = {
          debitsTotal: 0,
          creditsTotal: 0,
          balanceTotal: 0,
        };
        let liabilityTotal = {
          debitsTotal: 0,
          creditsTotal: 0,
          balanceTotal: 0,
        };

        const transcatios = res.body.data.summaryData.transactions;
        transcatios.forEach((item, index) => {
          if (item.chartOfAccount) {
            if (item.chartOfAccount.accountTypeId === "assets") {
              assetsTotal = {
                debitsTotal: assetsTotal.debitsTotal + item.debits,
                creditsTotal: assetsTotal.creditsTotal + item.credits,
                balanceTotal: assetsTotal.balanceTotal + item.balance,
              };
            }

            if (item.chartOfAccount.accountTypeId === "liability") {
              liabilityTotal = {
                debitsTotal: liabilityTotal.debitsTotal + item.debits,
                creditsTotal: liabilityTotal.creditsTotal + item.credits,
                balanceTotal: liabilityTotal.balanceTotal + item.balance,
              };
            }

            if (item.chartOfAccount.accountTypeId === "expenses") {
              expensesTotal = {
                debitsTotal: expensesTotal.debitsTotal + item.debits,
                creditsTotal: expensesTotal.creditsTotal + item.credits,
                balanceTotal: expensesTotal.balanceTotal + item.balance,
              };
            }

            if (item.chartOfAccount.accountTypeId === "equity") {
              equityTotal = {
                debitsTotal: equityTotal.debitsTotal + item.debits,
                creditsTotal: equityTotal.creditsTotal + item.credits,
                balanceTotal: equityTotal.balanceTotal + item.balance,
              };
            }
            rowData.push({
              id: index + 1,
              groupColumn:
                item.chartOfAccount.accountTypeId.charAt(0).toUpperCase() +
                item.chartOfAccount.accountTypeId.slice(1),
              column1: moment(item.date).format("DD/MM/YYYY"),
              column2:
                item.chartOfAccount.accountSubTypeId
                  .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                  .charAt(0)
                  .toUpperCase() +
                item.chartOfAccount.accountSubTypeId
                  .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                  .slice(1),
              column3: formatCurrency(parseFloat(item.debits).toFixed(2)),
              column4: formatCurrency(parseFloat(item.credits).toFixed(2)),
              column5: formatCurrency(parseFloat(item.balance).toFixed(2)),
            });
          }
        });

        setRowTotals({
          AssetsTotal: [
            "",
            "",
            parseFloat(assetsTotal.debitsTotal).toFixed(2),
            parseFloat(assetsTotal.creditsTotal).toFixed(2),
            parseFloat(assetsTotal.balanceTotal).toFixed(2),
          ],
          EquityTotal: [
            "",
            "",
            parseFloat(equityTotal.debitsTotal).toFixed(2),
            parseFloat(equityTotal.creditsTotal).toFixed(2),
            parseFloat(equityTotal.balanceTotal).toFixed(2),
          ],
          ExpensesTotal: [
            "",
            "",
            parseFloat(expensesTotal.debitsTotal).toFixed(2),
            parseFloat(expensesTotal.creditsTotal).toFixed(2),
            parseFloat(expensesTotal.balanceTotal).toFixed(2),
          ],
          LiabilityTotal: [
            "",
            "",
            parseFloat(liabilityTotal.debitsTotal).toFixed(2),
            parseFloat(liabilityTotal.creditsTotal).toFixed(2),
            parseFloat(liabilityTotal.balanceTotal).toFixed(2),
          ],
        });

        setRowData(rowData);
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
      customerId: customerID,
    };
    groflexService
      .request(
        `${config.resourceUrls.sendAccountingReport(
          "GeneralLedger",
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

  const handleCustomerDropDown = (option) => {
    setCustomerID(option.value);
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

  const onExportButtonClick = (label) => {
    const exportType = label.toLowerCase();
    groflexService
      .request(
        `${config.resourceUrls.generalLedger(
          date.startDate,
          date.endDate,
          exportType,
          customerID
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
        `${config.resourceUrls.generalLedger(
          date.startDate,
          date.endDate,
          exportType,
          customerID
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
            `Print initiated for GeneralLedger_${moment(date.startDate).format(
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
    <PageContent title={"General Ledger"}>
      <AdvancedCard
        type={"s-card"}
        style={{
          padding: "0px",
        }}
        className={"general-ledger-wrapper"}
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
        <div className="columns is-mulitline">
          <div
            className="column is-2"
            style={{
              marginTop: "-20px",
              marginBottom: "30px",
              marginLeft: "20px",
            }}
          >
            <SelectInput
              options={customerDropDownValues}
              placeholder={"Select Customer"}
              onChange={handleCustomerDropDown}
              value={customerID}
            />
          </div>
        </div>

        {rowData.length > 0 ? (
          <div>
            <div className="reports-summary">
              <h3 style={{ fontSize: "25px", fontWeight: "500" }}>
                {companyAddress?.companyName} General Ledger
              </h3>
              <span style={{ color: "rgb(136, 135, 135)", fontWeight: "500" }}>
                From {moment(date.startDate).format("DD MMMM YYYY")} to{" "}
                {moment(date.endDate).format("DD MMMM YYYY")}
              </span>
            </div>

            <div className="general-ledger-table">
              <ReportsTable
                rowData={rowData}
                tableHeaders={[
                  "| Date",
                  "| Account",
                  "| Debit",
                  "| Credit",
                  "| Balance",
                ]}
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
        fileName={`GeneralLedger_${moment(date.startDate).format(
          "DD-MM-YYYY"
        )}_${moment(date.endDate).format("DD-MM-YYYY")}`}
        title={"Send General Ledger"}
      />
    </PageContent>
  );
};

export default GeneralLedger;

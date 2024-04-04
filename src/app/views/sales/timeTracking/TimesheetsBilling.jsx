import React, { useEffect, useState } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import groflexService from "../../../services/groflex.service";
import oldConfig from "../../../../../oldConfig";
import { useNavigate, useParams } from "react-router-dom";
import { ListAdvancedComponent } from "../../../shared/components/list-advanced/ListAdvancedComponent";
import Timetracking from "../../../models/timetracking.model";
import { formatCurrency } from "../../../helpers/formatCurrency";
import { CustomShowHeaderSum } from "../../../shared/components/list-advanced/CustomShowHeaderSum";
import { Button } from "../../../shared/components/button/Button";
import { ButtonGroup } from "../../../shared/components/button/buttonGroup/ButtonGroup";
import timesheetsSvg from "../../../../assets/groflex/icons/timesheetsIcon.svg";
import Modal from "../../../shared/components/modal/Modal";
import RecordTimeModal from "./RecordTimeModal";
import DeleteRecordedTimeModal from "./DeleteRecordedTimeModal";
const TimesheetsBilling = () => {
  const { customerId, status } = useParams();
  // const [recordTimeModalVisible, setRecordTimeModalVisible] = useState(false);
  // const [recordTimeModalTitle, setRecordTimeModalTitle] =
  //   useState("Record Time");

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const navigate = useNavigate();
  const [delteModalInfo, setDeleteModalInfo] = useState({});
  const [workStats, setWorkStats] = useState({
    priceTotal: 0,
    time: "",
  });
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    customerNo: "",
    address: "",
    email: "",
  });
  useEffect(() => {
    fetchCustomerData();
  }, []);

  useEffect(() => {
    fetchInvoiceData();
  }, []);
  const fetchCustomerData = () => {
    groflexService
      .request(`${oldConfig.customer.resourceUrl}/${customerId}`, {
        auth: true,
      })
      .then((res) => {
        const response = res.body.data;
        setCustomerInfo({
          name: response.name,
          email: response.email,
          address: response.address.street,
          customerNo: response.number,
        });
      });
  };

  const fetchInvoiceData = () => {
    groflexService
      .request(
        `${oldConfig.timetracking.requestUrl.billing}${customerId}?status=${status}`,
        { auth: true }
      )
      .then((res) => {
        let totalAmount = 0;
        let totalTime = 0;
        res.body.data.forEach((item) => {
          totalAmount = totalAmount + item.priceTotal;
          totalTime = totalTime + item.durationInMinutes;
        });

        const test = new Timetracking({ durationInMinutes: totalTime });

        setWorkStats({
          priceTotal: totalAmount,
          time: test.trackedTimeString,
        });
      });
  };
  const actions = [
    { name: "Edit", icon: "edit" },
    { name: "Delete", icon: "trash-alt" },
    { name: "Convert to Deal", icon: "trash-alt" },
  ];

  const handleActionClick = (action, row, params) => {
    switch (action.action) {
      case "delete":
        setIsDeleteModalVisible(true);

        setDeleteModalInfo(row);
        break;
      case "edit":
        // setRecordTimeModalTitle("Edit recorded time");
        // setRecordTimeModalVisible(true);

        navigate(`/sales/time-sheets/record-time/${row.id}`);
        break;
      case "goToInvoice":
        navigate(`/sales/invoices/${row.invoice.id}`);
        break;
    }
  };
  const getActionPopupButtons = (item) => {
    const entries = [];
    switch (status) {
      case "open":
        entries.push({
          label: "Edit",
          action: "edit",
          dataQsId: "timesheet-list-item-dropdown-entry-edit",
        });
        entries.push({
          label: "Delete",
          action: "delete",
          dataQsId: "timesheet-list-item-dropdown-entry-delete",
        });
        break;
      case "invoiced":
        entries.push({
          label: "Go to invoice",
          action: "goToInvoice",
          dataQsId: "timesheet-list-item-dropdown-entry-go-to-invoice",
        });
        break;
    }

    return entries;
  };

  return (
    <PageContent
      title={customerInfo.name}
      titleActionContent={
        status === "open" && (
          <ButtonGroup>
            <Button
              onClick={() => navigate("/sales/invoices/create-new")}
              isSecondary
            >
              Create Invoice
            </Button>
            <Button
              onClick={() => {
                // setRecordTimeModalTitle("Record Time"),
                //   setRecordTimeModalVisible(true);
                navigate("/sales/time-sheets/record-time");
              }}
              isSuccess
            >
              Record Time
            </Button>
          </ButtonGroup>
        )
      }
    >
      {status === "open" && (
        <DeleteRecordedTimeModal
          isDeleteModalVisible={isDeleteModalVisible}
          setIsDeleteModalVisible={setIsDeleteModalVisible}
          rowData={delteModalInfo}
        />
      )}
      {/* {status === "open" && (
        <RecordTimeModal
          recordTimeModalVisible={recordTimeModalVisible}
          setRecordTimeModalVisible={setRecordTimeModalVisible}
          title={recordTimeModalTitle}
        />
      )} */}

      <div className="timesheets-billing-main">
        <div className="columns is-multiline">
          <div className="column is-5 customer-info-card">
            <AdvancedCard type={"s-card"} style={{ minHeight: "200px" }}>
              <h2 style={{ marginBottom: "10px" }}>{customerInfo.name}</h2>
              <div className="sub-info-box">
                <h2 className="sub-info-heading">Customer Number</h2>
                <h2 className="sub-info-heading">Addrss</h2>
              </div>
              <div className="sub-info-box">
                <h2>{customerInfo.customerNo}</h2>
                <h2>{customerInfo.address}</h2>
              </div>
              <div className="sub-info-box">
                <h2 className="sub-info-heading">Email</h2>
              </div>
              <div className="sub-info-box">
                <h2>{customerInfo.email}</h2>
              </div>
            </AdvancedCard>
          </div>
          <div className="column is-7">
            <AdvancedCard type={"s-card"}>
              <h2 className="title is-5 is-bold">Time Track</h2>
              <div className="time-track-text-container">
                <div className="time-container">
                  <h2 className="container-heading">Total Hours</h2>
                  <h2 className="container-value">{workStats.time}</h2>
                </div>
                <div className="price-container">
                  <h2 className="container-heading">Total Price</h2>
                  <h2 className="container-value" style={{ color: "#00a353" }}>
                    {formatCurrency(workStats.priceTotal)}
                  </h2>
                </div>
              </div>
              <div className="track-time-image-container">
                <div className="time-track-text">
                  <div className="time-value">{workStats.time}</div>
                  <div className="price-value">
                    {formatCurrency(workStats.priceTotal)}
                  </div>
                </div>
                <img src={timesheetsSvg} width={"166px"} height={"157px"} />
              </div>
            </AdvancedCard>
          </div>
        </div>
        <div className="columns is-multiline">
          <div className="column is-12">
            <AdvancedCard type={"s-card"}>
              <ListAdvancedComponent
                isFilter={false}
                pagination={false}
                onRowClicked={(e) => {
                  status === "invoiced" &&
                    navigate(`/sales/invoices/${e.data.invoice.id}`);
                }}
                responseDataMapFunc={(timetrackings) => {
                  const result = timetrackings.map((timetracking) => {
                    return new Timetracking(timetracking);
                  });

                  return result;
                }}
                onActionClick={handleActionClick}
                columnDefs={[
                  {
                    field: "date",
                    headerName: "Date",
                    valueGetter: (evt) => {
                      return evt.data.date;
                    },
                  },
                  {
                    field: "activity",
                    headerName: "Activity",
                    valueGetter: (evt) => {
                      return evt.data.taskDescriptionPrefix;
                    },
                  },
                  {
                    field: "durationInMinutes",
                    headerName: "Duration",
                    valueGetter: (evt) => {
                      return evt.data.trackedTimeString;
                    },
                  },
                  {
                    field: "priceTotal",
                    headerName: "Amount",
                    cellRenderer: (evt) => {
                      return formatCurrency(evt.value);
                    },
                    headerComponent: CustomShowHeaderSum,
                    headerComponentParams: {
                      value: "priceTotal",
                      headerName: "Amount",
                    },
                  },
                ]}
                fetchUrl={() =>
                  `${oldConfig.timetracking.requestUrl.billing}${customerId}?status=${status}`
                }
                actionMenuData={getActionPopupButtons}
              />
            </AdvancedCard>
          </div>
        </div>
      </div>
    </PageContent>
  );
};

export default TimesheetsBilling;

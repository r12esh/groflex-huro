import moment from "moment";

import { ListAdvancedComponent } from "../../../shared/components/list-advanced/ListAdvancedComponent";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { ListAdvancedDefaultSettings } from "../../../helpers/constants";
import { formatCurrency } from "../../../helpers/formatCurrency";
import { CustomShowHeaderSum } from "../../../shared/components/list-advanced/CustomShowHeaderSum";
import Modal from "../../../shared/components/modal/Modal";
import { useState } from "react";
import groflexService from "../../../services/groflex.service";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";
import config from "../../../../../newConfig";
import FontAwesomeIcon from "../../../shared/fontAwesomeIcon/FontAwesomeIcon";
import { useNavigate } from "react-router-dom";

// TODO: filter select
// TODO: remove settings button
const VendorPaymentsList = () => {
  let [isDeleteModalActive, setIsDeleteModalActive] = useState(false);
  let [deletingRowAndParams, setDeletingRowAndParams] = useState();

  let [isCancelModalActive, setIsCancelModalActive] = useState(false);
  let [cancellingRowAndParams, setCancellingRowAndParams] = useState();
  let [cancellationReason, setCancellationReason] = useState("");

  const navigate = useNavigate();

  const createActivity = (params) => {
    let val = "";
    let iconColor = "";

    switch (params.value.toLowerCase()) {
      case "open":
        val = "Open";
        iconColor = "#0071CA";
        break;
      case "draft":
        val = "Draft";
        iconColor = "#DDDDDD";
        break;
      case "cancelled":
        val = "Cancelled";
        iconColor = "#888787";
        break;
      case "paid":
        val = "Paid";
        iconColor = "#00A353";
        break;
      default:
        iconColor = "#D94339";
        val = "Overdue";
        break;
    }

    return (
      <div className="quotations-status">
        <FontAwesomeIcon name={"circle"} size={11} color={iconColor} />
        {val}
      </div>
    );
  };

  const capitalize = (text) => text[0].toUpperCase() + text.slice(1);

  return (
    <PageContent
      breadCrumbData={["Home", "Accounting", "Vendor Payments"]}
      titleIsBreadCrumb
      title="Vendor Payments"
    >
      <ListAdvancedComponent
        onRowClicked={(e) => {
          navigate(`/accounting/vendor-payment/${e.data.id}`);
        }}
        fetchUrl={config.resourceUrls.expenses}
        columnDefs={[
          {
            field: "date",
            headerName: "Recipient Date",
            valueFormatter: ({ value }) => moment(value).format("DD/MM/YYYY"),
          },
          {
            field: "customerData",
            headerName: "Payee",
            valueFormatter: ({ value }) => value.companyName,
          },
          {
            field: "type",
            headerName: "Type",
            valueFormatter: ({ value }) => capitalize(value),
          },
          {
            field: "status",
            headerName: "Status",
            cellRenderer: createActivity,
          },
          {
            field: "payKind",
            headerName: "Payment Type",
            valueFormatter: ({ value, data }) =>
              data.status === "cancelled" ? "Cancelled" : capitalize(value),
          },
          {
            field: "date",
            headerName: "Due since",
            valueFormatter: ({ value }) =>
              moment(new Date()).diff(moment(value), "days") + " days",
          },
          {
            field: "totalGross",
            headerName: "Total Gross",
            cellClass: ListAdvancedDefaultSettings.EXCEL_STYLE_IDS.Currency,
            valueFormatter: ({ value }) => formatCurrency(value),
            headerComponent: CustomShowHeaderSum,
            headerComponentParams: {
              value: "totalGross",
              headerName: "Total Gross",
            },
          },
        ]}
        actionMenuData={[
          { name: "Edit", icon: "edit" },
          ,
          { name: "Cancel Expense", icon: "ban" },
          { name: "Delete", icon: "trash-alt" },
        ]}
        onActionClick={(action, row, params) => {
          switch (action.name) {
            case "Edit":
              navigate(`/expense/edit/${row.id}`);
              break;
            case "Cancel Expense":
              setIsCancelModalActive(true);
              setCancellingRowAndParams([row, params]);
              break;
            case "Delete":
              setIsDeleteModalActive(true);
              setDeletingRowAndParams([row, params]);
              break;
          }
        }}
      />
      <Modal
        isActive={isCancelModalActive}
        setIsAcive={setIsCancelModalActive}
        title="Cancel Expense"
        submitBtnName="Cancel"
        cancelBtnName="Close"
        onSubmit={() => {
          let [row, params] = cancellingRowAndParams;
          // TODO: bug in groflex.request, body doesn't get sent
          groflexService
            .request(`${config.resourceUrls.expense}${row.id}/cancel`, {
              data: { notes: cancellationReason, refundType: "debits" },
            })
            .then(() => {
              // TODO: I don't know how to update ag-grid row to mark it as cancelled
              setIsCancelModalActive(false);
            });
        }}
      >
        <div className="field">
          <label className="label">Cancellation Reason (optional)</label>
          <div className="control">
            <textarea
              className="textarea"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
            />
          </div>
        </div>
      </Modal>
      <Modal
        isActive={isDeleteModalActive}
        setIsAcive={setIsDeleteModalActive}
        title="Delete Expense"
        submitBtnName="Delete"
        onSubmit={() => {
          let [row, params] = deletingRowAndParams;
          groflexService
            .request(`${config.resourceUrls.expense}${row.id}`, {
              auth: true,
              method: "DELETE",
            })
            .then((res) => {
              if (!res?.body?.message) {
                // TODO better check
                params.api.applyTransaction({ remove: [row] });
              }
              setIsDeleteModalActive(false);
            });
        }}
      >
        Do you really want to delete this expense? This process cannot be
        undone.
      </Modal>
    </PageContent>
  );
};
export default VendorPaymentsList;

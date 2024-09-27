import React, { useEffect } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { useNavigate } from "react-router-dom";
import config from "../../../../../config";
import { ListAdvancedDefaultSettings } from "../../../helpers/constants";
import { CustomShowHeaderSum } from "../../../shared/components/list-advanced/CustomShowHeaderSum";
import { ListAdvancedComponent } from "../../../shared/components/list-advanced/ListAdvancedComponent";
import { formatCurrency } from "../../../helpers/formatCurrency";
import { Button } from "../../../shared/components/button/Button";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";

import {
  dateCompareSort,
  localeCompare,
  localeCompareNumeric,
} from "../../../helpers/sortComparators";
import groflexService from "../../../services/groflex.service";
import FontAwesomeIcon from "../../../shared/fontAwesomeIcon/FontAwesomeIcon";
import { formatDateforUi } from "../../../helpers/dateFormatters";
const actions = [
  { name: "edit", icon: "edit" },
  { name: "delete", icon: "trash-alt" },
];

const type = (params) => {
  let res = "";
  switch (params.value) {
    case "recurringInvoice":
      res = "Recurring invoice";
      break;
    case "invoice":
      res = "Invoice";
      break;
    default:
      res = "default";
  }
  return <>{res}</>;
};

const createActivity = (params) => {
  let val = "";
  let iconColor = "";

  switch (params.value.toLowerCase()) {
    case "locked":
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

const InvoicesList = () => {
  const navigate = useNavigate();
  const handleActionClick = (action, row, params) => {
    switch (action.name) {
      case "Delete":
        groflexService
          .request(`${config.resourceUrls.invoice}${row.id}`, {
            auth: true,
            method: "DELETE",
          })
          .then((res) => {
            if (res?.body?.message) {
              console.log(res, "Delete Failed");
            } else {
              params.api.applyTransaction({ remove: [row] });
              console.log(res, "Deleted Succesfullyyy");
            }
          });
        break;
      case "Edit":
        navigate(`/sales/invoices/${row.id}`);
    }
  };
  return (
    <PageContent
      title="Invoices List"
      titleActionContent={<Button isSuccess>Create Invoices</Button>}
    >
      <ListAdvancedComponent
        onRowClicked={(e) => {
          navigate(`/sales/invoices/${e.data.id}`);
        }}
        onActionClick={handleActionClick}
        columnDefs={[
          {
            field: "state",
            headerName: "status",
            cellRenderer: createActivity,
            minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
          },
          {
            field: "customerData.name",
            headerName: "Customer Name",
            minWidth: 170,
          },
          {
            headerName: "Currency",
            field: "baseCurrency",
            minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
            comparator: localeCompare,
            hide: true,
            filterParams: {
              suppressMiniFilter: true,
            },
            valueFormatter: (evt) => {
              console.log(
                evt.value === "" || evt.value === null ? "INR" : evt.value
              );
              return evt.value === "" || evt.value === null ? "INR" : evt.value;
            },
          },
          {
            minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
            headerName: "Date created",
            field: "date",
            filter: true,
            comparator: (date1, date2) =>
              dateCompareSort(date1, date2, config.dateFormat.client),
            cellRenderer: (params) => {
              return formatDateforUi(new String(params.value));
            },
          },

          {
            minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
            field: "dueToDate",
            filter: true,
            comparator: (date1, date2) =>
              dateCompareSort(date1, date2, config.dateFormat.client),
            headerName: "Due Date",
            cellRenderer: (params) => {
              return params.value
                ? formatDateforUi(new String(params.value))
                : "-";
            },
          },

          // {
          //   field: "dueSince",
          //   comparator: localeCompareNumeric,
          //   filter: "agNumberColumnFilter",
          //   filterParams: {
          //     suppressAndOrCondition: true,
          //   },
          //   valueFormatter: (evt) => {
          //     console.log(evt, "MY VALUE");
          //     return evt.value ? evt.value + " days" : "";
          //   },
          //   headerName: "Due Since",
          //   minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
          // },

          {
            field: "totalGross",
            headerName: "Total Gross",
            cellClass: ListAdvancedDefaultSettings.EXCEL_STYLE_IDS.Currency,
            valueFormatter: (evt) => {
              return formatCurrency(evt.value);
            },
            headerComponent: CustomShowHeaderSum,
            headerComponentParams: { value: "totalGross", headerName: "Total" },
            minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
          },
          {
            field: "outstandingAmount",
            headerName: "Outstanding",
            cellClass: ListAdvancedDefaultSettings.EXCEL_STYLE_IDS.Currency,
            valueFormatter: (evt) => {
              return formatCurrency(evt.value);
            },
            headerComponent: CustomShowHeaderSum,
            headerComponentParams: {
              value: "outstandingAmount",
              headerName: "Total",
            },
            minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
          },
          {
            field: "type",
            headerName: "type",
            cellRenderer: type,
            minWidth: 150,
          },
        ]}
        fetchUrl={config.resourceUrls.invoices}
        actionMenuData={actions}
      />
    </PageContent>
  );
};

export default InvoicesList;

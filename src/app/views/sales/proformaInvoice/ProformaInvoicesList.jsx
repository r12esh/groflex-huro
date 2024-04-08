import React, { useEffect } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { useNavigate } from "react-router-dom";
import config from "../../../../../newConfig";
import { ListAdvancedDefaultSettings } from "../../../helpers/constants";
import { CustomShowHeaderSum } from "../../../shared/components/list-advanced/CustomShowHeaderSum";
import { ListAdvancedComponent } from "../../../shared/components/list-advanced/ListAdvancedComponent";
import { formatCurrency } from "../../../helpers/formatCurrency";
import { Button } from "../../../shared/components/button/Button";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";
import {
  dateCompareSort,
  localeCompare,
} from "../../../helpers/sortComparators";
import groflexService from "../../../services/groflex.service";
import FontAwesomeIcon from "../../../shared/fontAwesomeIcon/FontAwesomeIcon";
const actions = [
  { name: "edit", icon: "edit" },
  { name: "delete", icon: "trash-alt" },
];

const createActivity = (params) => {
  let iconColor = "";
  let val = "";

  switch (params.value.toLowerCase()) {
    case "accepted":
      iconColor = "#BEF9DC";
      val = "Accepted";
      break;
    case "open":
      iconColor = "#0071CA";
      val = "Open";
      break;
    case "invoiced":
      iconColor = "#00A353";
      val = "Invoiced";
      break;
    case "rejected":
      iconColor = "#888787";
      val = "Declined";
      break;
  }
  return (
    <div className="proforma-invoice-status">
      <FontAwesomeIcon name={"circle"} size={11} color={iconColor} />
      {val}
    </div>
  );
};

const ProformaInvoicesList = () => {
  const navigate = useNavigate();
  const handleActionClick = (action, row, params) => {
    switch (action.name) {
      case "Delete":
        groflexService
          .request(`${config.resourceUrls.quotation}${row.id}`, {
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
      // case "Edit":
      //   navigate(`/articles/edit/${row.id}`);
    }
  };
  return (
    <PageContent
      title="Proforma Invoices List"
      titleActionContent={
        <Button
          onClick={() => navigate("sales/proforma-invoices/new")}
          isPrimary
        >
          Create Proforma Invoice
        </Button>
      }
      breadCrumbData={["Home", "Sales", "Proforma Invoices"]}
    >
      <ListAdvancedComponent
        onRowClicked={(e) => {
          navigate(`/sales/proforma-invoices/${e.data.id}`);
        }}
        onActionClick={handleActionClick}
        columnDefs={[
          {
            field: "number",
            headerName: "Number",
          },
          {
            field: "state",
            headerName: "Status",
            cellRenderer: createActivity,
          },
          { field: "customerData.name", headerName: "Customer Name" },
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
          { field: "type", headerName: "Quotation Type" },

          // {
          //   field: "date",
          //   headerName: "Date Created",
          //   valueFormatter: (evt) => {
          //     return formatCurrency(evt.value);
          //   },
          // },
          {
            headerName: "Date created",
            field: "date",
            filter: true,
            comparator: (date1, date2) =>
              dateCompareSort(date1, date2, config.dateFormat.client),
          },

          {
            field: "totalGross",
            headerName: "Total Gross",
            cellClass: ListAdvancedDefaultSettings.EXCEL_STYLE_IDS.Currency,
            valueFormatter: (evt) => {
              return formatCurrency(evt.value);
            },
            headerComponent: CustomShowHeaderSum,
            headerComponentParams: { value: "totalGross", headerName: "Total" },
          },
        ]}
        fetchUrl={config.resourceUrls.quotations}
        actionMenuData={actions}
      />
    </PageContent>
  );
};

export default ProformaInvoicesList;

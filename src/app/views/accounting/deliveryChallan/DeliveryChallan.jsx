import React, { useEffect } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { ListAdvancedComponent } from "../../../shared/components/list-advanced/ListAdvancedComponent";
import { formatCurrency } from "../../../helpers/formatCurrency";
import config from "../../../../../newConfig";
import groflexService from "../../../services/groflex.service";
import moment from "moment";
import InvoiceState from "../../../enums/invoice/invoice-state.enum";
import FontAwesomeIcon from "../../../shared/fontAwesomeIcon/FontAwesomeIcon";
import { CustomShowHeaderSum } from "../../../shared/components/list-advanced/CustomShowHeaderSum";
import { ListAdvancedDefaultSettings } from "../../../helpers/constants";
const DeliveryChallan = () => {
  const handleActionClick = () => {};
  const getActionPopupButtons = (item) => {
    const entries = [];
    switch (item?.state?.toLowerCase()) {
      case "open":
        entries.push({
          label: "Edit",
          action: "edit",
          dataQsId: "delvery-challan-item-dropdown-entry-edit",
        });
        entries.push({
          label: "Delete",
          action: "delete",
          dataQsId: "delvery-challan-item-dropdown-entry-delete",
        });
        break;
    }

    return entries;
  };
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
  return (
    <PageContent title={"Delivery Challan"}>
      <ListAdvancedComponent
        actionMenuData={getActionPopupButtons}
        onRowClicked={(e) => {}}
        onActionClick={handleActionClick}
        columnDefs={[
          {
            field: "number",
            headerName: "Number",
          },
          {
            field: "date",
            headerName: "Date",
            cellRenderer: (evt) => {
              return moment(evt.value).format("DD/MM/YYYY");
            },
          },
          {
            field: "customerData.name",
            headerName: "Customer",
          },
          {
            field: "state",
            headerName: "Status",
            cellRenderer: createActivity,
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
        fetchUrl={config.resourceUrls.deliveryChallanList}
      />
    </PageContent>
  );
};

export default DeliveryChallan;

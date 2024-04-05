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
import { formatDateforUi } from "../../../helpers/dateFormatters";
import RecurringInvoiceStateEnum from "../../../enums/recurring-invoice/recurring-invoice-state.enum";
import FontAwesomeIcon from "../../../shared/fontAwesomeIcon/FontAwesomeIcon";

const actions = [
  { name: "Copy and edit", icon: "edit" },
  { name: "End recurring invoice", icon: "trash-alt" },
];

const interval = (p) => {
  let val;
  console.log(p);
  switch (p.value) {
    case "quarter":
      val = "3-months";
      break;
    case "biyearly":
      val = "half-yearly";
      break;
    default:
      val = "Weekly";
      break;
  }
  return <>{val}</>;
};
const createActivity = (params) => {
  let iconColor = "";
  let val = "";

  switch (params.value) {
    case RecurringInvoiceStateEnum.DRAFT:
      val = "Not started";
      iconColor = "#DDDDDD";
      break;
    case RecurringInvoiceStateEnum.STARTED:
      val = "Active";
      iconColor = "#0071CA";
      break;
    case RecurringInvoiceStateEnum.FINISHED:
      val = "Completed";
      iconColor = "#00A353";
      break;
    default:
      break;
  }
  return (
    <div className="recurringInvoices-status">
      <FontAwesomeIcon name={"circle"} size={11} color={iconColor} />
      {val}
    </div>
  );
};

const RecurringInvoicesList = () => {
  // const navigate = useNavigate();
  // const handleActionClick = (action, row, params) => {
  //   switch (action.name) {
  //     case "Delete":
  //       groflexService
  //         .request(`${config.resourceUrls.quotation}${row.id}`, {
  //           auth: true,
  //           method: "DELETE",
  //         })
  //         .then((res) => {
  //           if (res?.body?.message) {
  //             console.log(res, "Delete Failed");
  //           } else {
  //             params.api.applyTransaction({ remove: [row] });
  //             console.log(res, "Deleted Succesfullyyy");
  //           }
  //         });
  //       break;
  //     // case "Edit":
  //     //   navigate(`/articles/edit/${row.id}`);
  //   }
  // };
  return (
    <PageContent
      title="Recurring Invoices"
      titleActionContent={<Button isSuccess>Create recurring invoice</Button>}
    >
      <ListAdvancedComponent
        // onRowClicked={(e) => {
        //   navigate(`/articles/${e.data.id}`);
        // }}
        //onActionClick={handleActionClick}
        columnDefs={[
          {
            field: "state",
            headerName: "Status",
            cellRenderer: createActivity,
            minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
          },
          {
            field: "name",
            headerName: "customer",
            minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
          },
          {
            headerName: "subscription start",
            field: "startDate",
            filter: true,
            comparator: (date1, date2) =>
              dateCompareSort(date1, date2, config.dateFormat.client),
            cellRenderer: (params) => {
              return formatDateforUi(new String(params.value));
            },
            minWidth: 190,
          },
          {
            headerName: "Interval",
            field: "recurrence",
            cellRenderer: interval,
            minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
          },
          {
            field: "nextDate",
            headerName: "next date",
            cellRenderer: (params) => {
              if (params.data.state === RecurringInvoiceStateEnum.DRAFT) {
                return "Not started";
              }
              if (params.data.state === RecurringInvoiceStateEnum.FINISHED) {
                return "Subscription ended";
              }
              if (params.data.state === RecurringInvoiceStateEnum.STARTED) {
                return formatDateforUi(new String(params.value));
              }
            },
            minWidth: 160,
          },
          // {
          //   field: "date",
          //   headerName: "Date Created",
          //   valueFormatter: (evt) => {
          //     return formatCurrency(evt.value);
          //   },
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
        ]}
        fetchUrl={config.resourceUrls.recurring}
        actionMenuData={actions}
      />
    </PageContent>
  );
};

export default RecurringInvoicesList;

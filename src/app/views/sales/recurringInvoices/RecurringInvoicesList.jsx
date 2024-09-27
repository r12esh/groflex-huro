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
} from "../../../helpers/sortComparators";
import groflexService from "../../../services/groflex.service";

const actions = [
  { name: "Copy and edit", icon: "edit" },
  { name: "End recurring invoice", icon: "trash-alt" },
];

const interval=(p)=>{
  let val;
  console.log(p)
  switch (p.value) {
    case 'quarter':
       val="3-months"
      break;
  case 'biyearly':
  val="half-yearly"
  break;
    default:
      val="Weekly"
      break;
  }
  return<>
  {val}
  </>
}
const createActivity = (params) => {
  let iconColor = "";
  let icon = "";

  switch (params.value.toLowerCase()) {
    case "draft":
      icon = "AlertCircle";
      iconColor = "#181d1f";
      break;
    case "started":
      icon = "CheckCircle";
      iconColor = "#181d1f";
      break;
    default:
      icon = "Phone";
      iconColor = "#d94339";
      break;
  }
  return (
    <div className="recurringInvoices-status">
      <FeatherIcon name={icon} color={iconColor}  />
       {/* {params.value} */}
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
  //     //   navigate(`/article/edit/${row.id}`);
  //   }
  // };
  return (
    <PageContent
      title="Recurring Invoices List"
      titleActionContent={<Button isSuccess>Create recurring invoice</Button>}
    >
      <ListAdvancedComponent
        // onRowClicked={(e) => {
        //   navigate(`/article/${e.data.id}`);
        // }}
        //onActionClick={handleActionClick}
        columnDefs={[
          {
            field: "name",
            headerName: "customer",
          },
          {
            headerName: "subscription start",
            field: "startDate",
            filter: true,
            comparator: (date1, date2) =>
              dateCompareSort(date1, date2, config.dateFormat.client),
          },
          {
            headerName: "Interval",
            field: "recurrence",
            cellRenderer: interval
          },

          {
            field: "state",
            headerName: "Status",
            cellRenderer: createActivity,
          },

          {
            field: "nextDate",
            headerName: "next date",
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
          },
        ]}
        fetchUrl={config.resourceUrls.recurring}
        actionMenuData={actions}
      />
    </PageContent>
  );
};

export default RecurringInvoicesList;

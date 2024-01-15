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
import { dateCompareSort, localeCompare } from "../../../helpers/sortComparators";
import groflexService from "../../../services/groflex.service";
const actions = [
  { name: "Edit", icon: "edit" },
  { name: "Delete", icon: "trash-alt" },
];

const createActivity = (params) => {
  let iconColor = "";
  let icon = "";

  switch (params.value.toLowerCase()) {
    case "accepted":
      icon = "CheckCircle";
      iconColor = "#5FAF3A";
      break;
    case "open":
      icon = "Clock";
      iconColor = "#5FAF3A";
      break;
    default:
      icon = "Phone";
      iconColor = "#d94339";
      break;
  }
  return (
    <div className="quotations-status">
      <FeatherIcon name={icon} color={iconColor} />
      {params.value}
    </div>
  );
};

const QuotationsList = () => {
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
      //   navigate(`/article/edit/${row.id}`);
    }
  };
  return (
    <PageContent
      title="Quotaiton List"
      titleActionContent={
        <Button onClick={() => navigate("/quotations/new")} isSuccess>
          Create Quotation
        </Button>
      }
    >
      <ListAdvancedComponent
        // onRowClicked={(e) => {
        //   navigate(`/article/${e.data.id}`);
        // }}
        onActionClick={handleActionClick}
        columnDefs={[
          {
            field: "number",
            headerName: "Number",
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
              console.log(evt.value === "" || evt.value === null ? "INR" : evt.value)
              return evt.value === "" || evt.value === null ? "INR" : evt.value;
            },
          },
          {field:"type",headerName:"Quotation Type"},
          { field: "state", headerName: "Status",
          cellRenderer: createActivity,},
          
          
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
            comparator: (date1, date2) => dateCompareSort(date1, date2, config.dateFormat.client),
   
          },

          { field: "totalGross", headerName: "Total Gross" ,
          cellClass: ListAdvancedDefaultSettings.EXCEL_STYLE_IDS.Currency,
          valueFormatter: (evt) => {
            return formatCurrency(evt.value);
          },
          headerComponent: CustomShowHeaderSum,
          headerComponentParams: { value: "totalGross", headerName: "Total" }},
        ]}
        fetchUrl={config.resourceUrls.quotations}
        actionMenuData={actions}
      />
    </PageContent>
  );
};

export default QuotationsList;

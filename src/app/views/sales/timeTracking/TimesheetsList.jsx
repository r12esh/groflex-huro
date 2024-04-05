import React, { useEffect } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { ListAdvancedComponent } from "../../../shared/components/list-advanced/ListAdvancedComponent";
import oldConfig from "../../../../../oldConfig";
import Timetracking from "../../../models/timetracking.model";
import FontAwesomeIcon from "../../../shared/fontAwesomeIcon/FontAwesomeIcon";
import { formatCurrency } from "../../../helpers/formatCurrency";
import { ListAdvancedDefaultSettings } from "../../../helpers/constants";
import { CustomShowHeaderSum } from "../../../shared/components/list-advanced/CustomShowHeaderSum";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/components/button/Button";

const TimesheetsList = () => {
  const navigate = useNavigate();

  const getStatusIcon = (evt) => {
    let icon = "";
    let text = "";
    switch (evt.value) {
      case "invoiced":
        text = "Invoiced";
        icon = "#00A353";
        break;
      case "open":
        text = "Open";
        icon = "#0071CA";
        break;
    }

    return (
      <div className="quotations-status">
        <FontAwesomeIcon name={"circle"} size={11} color={icon} />
        {text}
      </div>
    );
  };

  const getActionPopupButtons = (item) => {
    const entries = [];
    entries.push({
      label: "Edit",
      action: "edit",
      dataQsId: "timesheet-list-item-dropdown-entry-edit",
    });

    return entries;
  };

  const handleActionClick = (action, row, params) => {
    switch (action.action) {
      case "delete":
        break;
      case "edit":
        navigate(
          `/sales/time-sheets/billed/customer/${row.customerId}/${row.status}`
        );
        break;
    }
  };
  return (
    <PageContent
      title="Timesheets"
      titleActionContent={
        <Button
          onClick={() => {
            navigate("/sales/time-sheets/record-time");
          }}
          isSuccess
        >
          Record Time
        </Button>
      }
    >
      <ListAdvancedComponent
        onRowClicked={(e) => {
          navigate(
            `/sales/time-sheets/billed/customer/${e.data.customerId}/${e.data.status}`
          );
        }}
        onActionClick={handleActionClick}
        columnDefs={[
          {
            field: "customerId",
            headerName: "Customer No",
            // cellRenderer: createLabel,
          },

          {
            field: "status",
            headerName: "Status",
            cellRenderer: (evt) => getStatusIcon(evt),
          },
          {
            field: "customerName",
            headerName: "Customer",
            // cellRenderer: createActivity,
          },
          {
            field: "rowCount",
            headerName: "Expenses",
            cellRenderer: (evt) => {
              return evt.data.displayEffort;
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
            cellClass: ListAdvancedDefaultSettings.EXCEL_STYLE_IDS.Currency,
            valueFormatter: ({ value }) => formatCurrency(value),
            valueFormatter: (evt) => {
              return formatCurrency(evt.value);
            },
            headerComponent: CustomShowHeaderSum,
            headerComponentParams: {
              value: "priceTotal",
              headerName: "Amount",
            },
          },
        ]}
        responseDataMapFunc={(timetrackings) => {
          const result = timetrackings.map((timetracking) => {
            return new Timetracking(timetracking);
          });

          return result;
        }}
        fetchUrl={(offset, limit, filter) =>
          `${oldConfig.timetracking.resourceUrl}?offset=${offset}&searchText=&limit=${limit}&orderBy=customerName&desc=true&filter=${filter}`
        }
        actionMenuData={getActionPopupButtons}
        defaultFilterValue="default"
      />
    </PageContent>
  );
};

export default TimesheetsList;

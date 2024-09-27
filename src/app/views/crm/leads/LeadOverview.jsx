import React, { useState } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { ListAdvancedComponent } from "../../../shared/components/list-advanced/ListAdvancedComponent";
import { formatCurrency } from "../../../helpers/formatCurrency";
import {
  ListAdvancedDefaultSettings,
  customerTypes,
} from "../../../helpers/constants";
import { CustomShowHeaderSum } from "../../../shared/components/list-advanced/CustomShowHeaderSum";
import config from "../../../../../config";
import groflexService from "../../../services/groflex.service";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/components/button/Button";
import { isNil } from "../../../helpers/isNil";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";

const LeadOverview = () => {
  const actions = [
    { name: "Edit", icon: "edit" },
    { name: "Delete", icon: "trash-alt" },
    { name: "Convert to Deal", icon: "trash-alt" },
  ];
  const navigate = useNavigate();

  //leads array of objects to render list advanced component
  const leads = [
    {
      id: 0,
      leadName: "Anu sharma",
      activity: "Active",
      phoneNumber: "+123456789",
      email: "agarwal@icloud.com",
      source: "Manually Created",
      owner: "Adam Smith",
      label: "hot",
    },
    {
      id: 1,
      leadName: "Kashvi Ahuja",
      activity: "No Activity",
      phoneNumber: "+123456789",
      email: "akahuja@yahoo.com",
      source: "Import",
      owner: "Adam Smith",
      label: "warm",
    },
    {
      id: 2,
      leadName: "Kashvi Ahuja",
      activity: "Yesterday at 7:53",
      phoneNumber: "+123456789",
      email: "akahuja@yahoo.com",
      source: "Web Forms",
      owner: "Adam Smith",
      label: "cold",
    },
  ];

  //list advanced cell renderer function to render label column with icon
  const createLabel = (params) => {
    let cellColor = "";
    switch (params.value.toLowerCase()) {
      case "hot":
        cellColor = "#D94339";
        break;
      case "warm":
        cellColor = "#FFAA2C";
        break;
      case "cold":
        cellColor = "#0071CA";
        break;
    }
    return (
      <div
        className="status-label"
        style={{
          background: cellColor,
        }}
      >
        {params.value}
      </div>
    );
  };

  //list advanced cell renderer function to render Activity column with icon
  const createActivity = (params) => {
    let iconColor = "";
    let icon = "";

    switch (params.value.toLowerCase()) {
      case "active":
        icon = "CheckCircle";
        iconColor = "#5FAF3A";
        break;
      case "no activity":
        icon = "AlertTriangle";
        iconColor = "#FFAA2C";
        break;
      default:
        icon = "Phone";
        iconColor = "#d94339";
        break;
    }
    return (
      <div className="lead-activity">
        <FeatherIcon name={icon} color={iconColor} />
        {params.value}
      </div>
    );
  };

  //list advanced cell renderer function to render Source column with icon
  const createSource = (params) => {
    let icon = "";
    switch (params.value.toLowerCase()) {
      case "manually created":
        icon = "User";
        break;
      case "import":
        icon = "Download";
        break;
      case "web forms":
        icon = "Grid";
        break;
    }
    return (
      <div className="lead-source">
        <FeatherIcon name={icon} />
        {params.value}
      </div>
    );
  };
  const handleActionClick = (action, rowData) => {
    if (rowData) {
      if (action.name === "Edit") {
        if (rowData.id) {
          setSelectedContact(rowData.id);
          const previousData = { ...rowData };
          setPreviousData(previousData);
          navigate(`/contacts-edit/${rowData.id}`, {
            state: { previousData },
          });
        } else {
          console.log("Invalid rowData:", rowData);
        }
      } else if (action.name === "Delete") {
        // Implement delete functionality
      }
    } else {
      console.log("Invalid rowData:", rowData);
    }
  };

  return (
    <PageContent
      title="Leads Overview"
      titleIsBreadCrumb
      breadCrumbData={["Home", "CRM", "Leads"]}
      titleActionContent={
        <Button onClick={() => navigate("/crm/leads/create-lead")} isSuccess>
          Create Lead
        </Button>
      }
    >
      <div className="leads-overview-wrapper">
        <ListAdvancedComponent
          onRowClicked={(e) => {
            navigate(`/crm/leads/${e.data.id}`);
          }}
          onActionClick={handleActionClick}
          columnDefs={[
            {
              field: "label",
              headerName: "Label",
              cellRenderer: createLabel,
            },

            { field: "leadName", headerName: "Lead Name" },
            {
              field: "activity",
              headerName: "Activity",
              cellRenderer: createActivity,
            },
            { field: "phoneNumber", headerName: "Phone" },
            { field: "email", headerName: "E-mail" },

            {
              field: "source",
              headerName: "Source",
              cellRenderer: createSource,
            },
            { field: "owner", headerName: "Owner" },
          ]}
          fetchUrl={config.resourceUrls.customers}
          customRowData={leads}
          actionMenuData={actions}
        />
      </div>
    </PageContent>
  );
};

export default LeadOverview;

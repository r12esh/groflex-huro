import React from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import { Button } from "../../../shared/components/button/Button";
import { ListAdvancedComponent } from "../../../shared/components/list-advanced/ListAdvancedComponent";
import config from "../../../../../config";
const LeadDetails = () => {
  const leadDetails = {
    Mobile: "1234567891",
    Address: "#123, abc Banglore",
    Email: "a@gmail.com",
    Website: "demo.com",
    Company: "Shell Company",
  };
  const leadAdditionalInfo = {
    CreatedLead: "12-10-2023",
    Source: "Campaign",
    Activity: "Active",
    Label: "Hot",
  };
  const handleActionClick = () => {};
  const actions = [
    { name: "Edit", icon: "edit" },
    { name: "Delete", icon: "trash-alt" },
  ];
  return (
    <PageContent
      title="Lead Info"
      titleIsBreadCrumb
      breadCrumbData={["Home", "Crm"]}
      titleActionContent={""}
    >
      <div className="crm-lead-details-wrapper">
        <div className="columns is-multiline">
          <div className="column is-7 left-card">
            <div className="lead-basic-info-card">
              <AdvancedCard type={"s-card"}>
                <div className="lead-image"></div>
                <div className="lead-info">
                  <h6 className="lead-name">Person</h6>
                  <h6 className="lead-role">Retailer</h6>
                </div>
                <div className="lead-button-container">
                  <Button isOutlined isPrimary isBold className={"mr-5"}>
                    Edit
                  </Button>
                  <Button isPrimary>Convert to deal</Button>
                </div>
              </AdvancedCard>
            </div>
            <div className="m-t-20" />
            <div className="lead-details-card">
              <AdvancedCard type={"s-card"}>
                <h2 className="title is-5">Lead Details</h2>
                <div className="lead-details">
                  {Object.keys(leadDetails).map((lead, id) => (
                    <div className="lead-details-container" key={id}>
                      <h6>{lead}</h6>
                      <span>{leadDetails[lead]}</span>
                    </div>
                  ))}
                </div>
              </AdvancedCard>
            </div>
            <div className="m-t-20" />
            <div className="lead-additional-details-card">
              <AdvancedCard type={"s-card"}>
                <h2 className="title is-5">Additional Information</h2>
                {Object.keys(leadAdditionalInfo).map((item, id) => (
                  <div className="lead-additional-details-container" key={id}>
                    <h6 className="additional-info-heading">
                      {item.replace(/([A-Z])/g, " $1").trim()}
                    </h6>
                    <span className={`${item}`}>
                      {leadAdditionalInfo[item]}
                    </span>
                  </div>
                ))}
              </AdvancedCard>
            </div>
          </div>

          <div className="column is-5 right-card">
            <AdvancedCard type={"s-card"}>
              <h2 className="title is-5">Lead History</h2>
              <ListAdvancedComponent
                onActionClick={handleActionClick}
                columnDefs={[
                  { field: "title", headerName: "Title" },
                  { field: "date", headerName: "Date" },
                  { field: "assignedUser", headerName: "Assigned User" },
                  { field: "description", headerName: "Description" },
                ]}
                fetchUrl={config.resourceUrls.customers}
                actionMenuData={actions}
              />
            </AdvancedCard>
          </div>
        </div>
      </div>
    </PageContent>
  );
};

export default LeadDetails;

import React from "react";
import Accordion from "../../../shared/components/accordion/Accordion";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import { Button } from "../../../shared/components/button/Button";
import { ListAdvancedComponent } from "../../../shared/components/list-advanced/ListAdvancedComponent";
import { ListAdvancedDefaultSettings } from "../../../helpers/constants";
import { CustomShowHeaderSum } from "../../../shared/components/list-advanced/CustomShowHeaderSum";
import { formatCurrency } from "../../../helpers/formatCurrency";
import config from "../../../../../config";
const ContactManagementActivity = () => {
  const actions = [
    { name: "Edit", icon: "edit" },
    { name: "Delete", icon: "trash-alt" },
  ];
  const activities = [
    {
      activityName: (
        <>
          <FeatherIcon name={"Phone"} size={15} />
          <h5>Kiran Bala called Abha Sarin</h5>
        </>
      ),
      activityDate: "18.08.2023. at 2:46 PM",
    },
    {
      activityName: (
        <>
          <FeatherIcon name={"Phone"} size={15} />
          <h5>Kiran Bala called Abha Sarin</h5>
        </>
      ),
      activityDate: "18.08.2023. at 2:46 PM",
    },
    {
      activityName: (
        <>
          <FeatherIcon name={"Phone"} size={15} />
          <h5>Kiran Bala called Abha Sarin</h5>
        </>
      ),
      activityDate: "18.08.2023. at 2:46 PM",
    },
    {
      activityName: (
        <>
          <FeatherIcon name={"Phone"} size={15} />
          <h5>Kiran Bala called Abha Sarin</h5>
        </>
      ),
      activityDate: "18.08.2023. at 2:46 PM",
    },
  ];
  const handleActionClick = () => {};
  return (
    <div className="contact-management-activity-wrapper">
      <AdvancedCard type={"s-card"}>
        <div className="contact-management-activity-header">
          <h2 className="title is-5">Recent Activity</h2>
          <Button isOutlined isPrimary isBold className={"mr-5"}>
            See More
          </Button>
        </div>

        {activities.map((activity, id) => (
          <div key={`activity-${id}`} className="activity-accordian-container">
            <Accordion
              accordionLeftHeader={activity.activityName}
              accordianRightHeader={activity.activityDate}
              accordionBody={"Acitivity Sample Content"}
            />
          </div>
        ))}
      </AdvancedCard>
      <div className="m-t-20" />
      <AdvancedCard type={"s-card"}>
        <h2 className="title is-5">Deals</h2>
        <ListAdvancedComponent
          onActionClick={handleActionClick}
          columnDefs={[
            { field: "dealName", headerName: "Deal Name" },
            { field: "amount", headerName: "Amount" },

            {
              field: "price",
              headerName: "Price",
              cellClass: ListAdvancedDefaultSettings.EXCEL_STYLE_IDS.Currency,
              valueFormatter: (evt) => {
                return formatCurrency(0);
              },

              headerComponentParams: { value: "mrp", headerName: "MRP" },
            },
            { field: "closedDate", headerName: "Closed Date" },
          ]}
          fetchUrl={config.resourceUrls.customers}
          actionMenuData={actions}
        />
      </AdvancedCard>
    </div>
  );
};

export default ContactManagementActivity;

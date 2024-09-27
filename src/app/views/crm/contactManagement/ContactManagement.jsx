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
const getCompanyPersonIcon = (
  value,
  personIconWidth,
  blankContactPersonIcon,
  isMainContact
) => {
  const masterDetailArrowClass =
    !isNil(isMainContact) && isMainContact.toString() === "false" ? "grey" : "";

  return value === customerTypes.PERSON ? (
    `<span class="icon-user-wrapper"><img src="/assets/images/svg/user.svg" width="${personIconWidth}" /></span>`
  ) : value === ListAdvancedDefaultSettings.CUSTOMER_TYPE_CONTACTPERSON ? (
    blankContactPersonIcon ? (
      ""
    ) : (
      `<span class="icon icon-arrow_right2 master-detail-arrow ${masterDetailArrowClass}"></span>`
    )
  ) : (
    <i style={{ color: "#00A353" }} className={"fas fa-building"}></i>
  );
};

const ContactManagement = () => {
  const actions = [
    { name: "Edit", icon: "edit" },
    { name: "Delete", icon: "trash-alt" },
  ];

  const contacts = [
    {
      id: 0,
      customerName: "Shivali Mall",
      companyName: "Company 1",
      email: "janedoe@domain.com",
      phoneNumber: "+123456789",
      closedDeals: 25,
      openDeals: 1,
      nextActivityDate: "16.09.2023",
      contactOwner: "Kiran Bala",
      label: "Hot",
      continent: "Asia",
      country: "India",
      city: "Delhi",
      businessType: "Small",
      profit: "20%",
      purchaseBehaviour: "regular",
    },
    {
      id: 1,
      customerName: "Navin Muni",
      companyName: "Company 1",
      email: "janedoe@domain.com",
      phoneNumber: "+123456789",
      closedDeals: 25,
      openDeals: 1,
      nextActivityDate: "16.09.2023",
      contactOwner: "Kiran Bala",
      label: "Warm",
    },
    {
      id: 2,
      customerName: "Abha Sarin",
      companyName: "Company 1",
      email: "janedoe@domain.com",
      phoneNumber: "+123456789",
      closedDeals: 25,
      openDeals: 1,
      nextActivityDate: "16.09.2023",
      contactOwner: "Kiran Bala",
      label: "Cold",
    },
  ];
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

  const navigate = useNavigate();
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
      title="Contact Management"
      titleIsBreadCrumb
      breadCrumbData={["Home", "Crm"]}
      titleActionContent={
        <Button
          onClick={() => navigate("/crm/contact-management/create-contact")}
          isSuccess
        >
          Create new contact
        </Button>
      }
    >
      <div className="contact-management-wrapper">
        <ListAdvancedComponent
          onRowClicked={(e) => {
            console.log(e);
            navigate(`/crm/contact-management/${e.data.id}`);
          }}
          onActionClick={handleActionClick}
          columnDefs={[
            // { field: "number", headerName: "No.", filter: false },

            { field: "customerName", headerName: "Customer Name" },
            {
              field: "label",
              headerName: "Label",
              cellRenderer: createLabel,
            },

            { field: "companyName", headerName: "Company Name" },
            { field: "email", headerName: "E-mail" },
            { field: "phoneNumber", headerName: "Phone" },
            {
              field: "closedDeals",
              headerName: "Closed Deals",
              valueFormatter: (evt) => {
                return evt.value;
              },
            },
            {
              field: "openDeals",
              headerName: "openDeals",
              valueFormatter: (evt) => {
                return evt.value;
              },
            },
            {
              field: "nextActivityDate",
              headerName: "Next Activity Date",
              valueFormatter: (evt) => {
                return evt.value;
              },
            },
            { field: "contactOwner", headerName: "Contact Owner" },
          ]}
          // fetchUrl={config.resourceUrls.customers}
          customRowData={contacts}
          actionMenuData={actions}
        />
      </div>
    </PageContent>
  );
};

export default ContactManagement;

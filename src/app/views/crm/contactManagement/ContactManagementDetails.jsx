import React, { useState } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import { Button } from "../../../shared/components/button/Button";
import { ListAdvancedComponent } from "../../../shared/components/list-advanced/ListAdvancedComponent";

import { Input } from "../../../shared/components/input/Input";

import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";
import Tabs from "../../../shared/components/tabs/Tabs";
import ContactManagementActivity from "./ContactManagementActivity";
import ContactManagementEmail from "./ContactManagementEmail";
import ContactManagementCall from "./ContactManagementCall";
import ContactManagementMeeting from "./ContactManagementMeeting";
const ContactManagementDetails = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const contactList = [
    {
      contactName: "Arushi Nath",
      companyName: "Business Development at ASL India",
      contactEmail: "arushinath@mail.com",
      contactPhone: "+123456789",
    },
    {
      contactName: "Arushi Nath",
      companyName: "Business Development at ASL India",
      contactEmail: "arushinath@mail.com",
      contactPhone: "+123456789",
    },
    {
      contactName: "Arushi Nath",
      companyName: "Business Development at ASL India",
      contactEmail: "arushinath@mail.com",
      contactPhone: "+123456789",
    },
    {
      contactName: "Arushi Nath",
      companyName: "Business Development at ASL India",
      contactEmail: "arushinath@mail.com",
      contactPhone: "+123456789",
    },
    {
      contactName: "Arushi Nath",
      companyName: "Business Development at ASL India",
      contactEmail: "arushinath@mail.com",
      contactPhone: "+123456789",
    },
    {
      contactName: "Arushi Nath",
      companyName: "Business Development at ASL India",
      contactEmail: "arushinath@mail.com",
      contactPhone: "+123456789",
    },
  ];
  const [contactDetails, setContactDetails] = useState({
    email: "",
    state: "",
    createdDate: "",
    contactOwner: "",
    closedDeals: "",
  });

  const handleEmailChange = (e) => {
    setContactDetails({
      ...contactDetails,
      email: e.target.value,
    });
  };
  const handleStateChange = (e) => {
    setContactDetails({
      ...contactDetails,
      state: e.target.value,
    });
  };
  const handleCreatedDateChange = (e) => {
    setContactDetails({
      ...contactDetails,
      createdDate: e.target.value,
    });
  };
  const handleContactOwnerChange = (e) => {
    setContactDetails({
      ...contactDetails,
      contactOwner: e.target.value,
    });
  };
  const handleclosedDealsChange = (e) => {
    setContactDetails({
      ...contactDetails,
      closedDeals: e.target.value,
    });
  };
  const handleActionClick = () => {};

  const utilityIcons = [
    { label: "Email", icon: "Mail" },
    { label: "Call", icon: "Phone" },
    { label: "Notes", icon: "File" },
  ];

  const tabsList = ["team", "projects", "tasks"];

  const Call = () => {
    return <div>Call tab</div>;
  };
  const tabList = [
    { label: "Activity", content: <ContactManagementActivity /> },
    { label: "Email", content: <ContactManagementEmail /> },
    { label: "Call", content: <ContactManagementCall /> },
    { label: "Meeting", content: <ContactManagementMeeting /> },
  ];
  const handleTabChange = (event) => {
    setSelectedTab(event);
  };

  return (
    <PageContent
      title="Contact Management"
      titleIsBreadCrumb
      breadCrumbData={["Home", "Crm"]}
      titleActionContent={""}
    >
      <div className="contact-management-details-wrapper">
        <div className="columns is-multiline">
          <div className="column is-7 left-content">
            <div className="contact-basic-info-container">
              <AdvancedCard type={"s-card"}>
                <h2 className="title is-5">Contact Info</h2>
                <div className="contact-image"></div>
                <div className="utility-icons-container">
                  {utilityIcons.map((item, id) => (
                    <div className="utility-icons" key={`utility-icon-${id}`}>
                      <FeatherIcon name={item.icon} />
                      <span className="utilit-icon-label">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="contact-basic-info-fields">
                  <div className="columns is-multiline m-b-5">
                    <div className="column is-12">
                      <div className="field">
                        <label>Email</label>
                        <Input
                          onChange={handleEmailChange}
                          type={"text"}
                          placeholder={"None"}
                          value={""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="columns is-multiline m-b-5">
                    <div className="column is-12">
                      <div className="field">
                        <label>State</label>
                        <Input
                          onChange={handleStateChange}
                          type={"text"}
                          placeholder={"None"}
                          value={""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="columns is-multiline m-b-5">
                    <div className="column is-12">
                      <div className="field">
                        <label>Created Date</label>
                        <Input
                          onChange={handleCreatedDateChange}
                          type={"text"}
                          placeholder={"None"}
                          value={""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="columns is-multiline m-b-5">
                    <div className="column is-12">
                      <div className="field">
                        <label>Contact Owner</label>
                        <Input
                          onChange={handleContactOwnerChange}
                          type={"text"}
                          placeholder={"None"}
                          value={""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="columns is-multiline m-b-5">
                    <div className="column is-12">
                      <div className="field">
                        <label>Closed Deals</label>
                        <Input
                          onChange={handleclosedDealsChange}
                          type={"text"}
                          placeholder={"None"}
                          value={""}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-divider"></div>
                <div className="contact-management-details-contact-list">
                  <h3 className="title is-5">Contact Info</h3>
                  {contactList.map((contact, id) => (
                    <div className="contact-container" key={`contact-${id}`}>
                      <h5 className="contact-name">{contact.contactName}</h5>
                      <span className="company-name">
                        {contact.companyName}
                      </span>
                      <span className="contact-email">
                        {contact.contactEmail}
                      </span>
                      <span className="contact-phone">
                        {contact.contactPhone}
                      </span>
                    </div>
                  ))}
                </div>
              </AdvancedCard>
            </div>
          </div>

          <div className="column is-5 right-content">
            <Tabs tabList={tabList} />
          </div>
        </div>
      </div>
    </PageContent>
  );
};

export default ContactManagementDetails;

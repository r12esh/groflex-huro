import React, { useEffect, useState } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { Button } from "../../../shared/components/button/Button";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import { Input } from "../../../shared/components/input/Input";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";

const DealsOverview = () => {
  const [searchText, setSearchText] = useState("");
  const dealsSummary = [
    { heading: "Deal Amount", value: `₹${0}`, color: "#0071CA" },
    { heading: "Open Deal Amount", value: `₹${0}`, color: "#0071CA" },
    { heading: "Closed Won Amount", value: `₹${0}`, color: "#00A353" },
    { heading: "Lost Deal Amount", value: `₹${0}`, color: "#D94339" },
    { heading: "Average Deal Age", value: `${0} days`, color: "#0071CA" },
  ];
  const serviceCardDetails = [
    {
      serviceName: "Cargo service",
      serviceAmount: 1000,
      taskAssignedTo: "Michael Show",
      numberOfTasks: 0,
      taskDueDays: 0,
      status: (
        <FeatherIcon name={"Circle"} color="red" style={{ fill: "red" }} />
      ),
    },
    {
      serviceName: "Book Keeping Service",
      serviceAmount: 1000,
      taskAssignedTo: "Michael Show",
      numberOfTasks: 1,
      taskDueDays: 3,
      status: (
        <FeatherIcon
          name={"Circle"}
          color="#FFAA2C"
          style={{ fill: "#FFAA2C" }}
        />
      ),
    },
    {
      serviceName: "Payroll Management",
      serviceAmount: 500,
      taskAssignedTo: "Michael Show",
      numberOfTasks: 0,
      taskDueDays: 0,
      status: (
        <FeatherIcon
          name={"Circle"}
          color="#00A353"
          style={{ fill: "#00A353" }}
        />
      ),
    },
  ];
  const [filteredServiceCards, setFilteredServiceCards] =
    useState(serviceCardDetails);

  const serviceColumns = [
    {
      serviceHeading: "Prospecting",
      serviceDeals: 3,
      serviceAmount: 2500,
      headerColor: "#00A353",
      cards: filteredServiceCards,
    },
    {
      serviceHeading: "Contact",
      serviceDeals: 3,
      serviceAmount: 2500,
      headerColor: "#888787",
      cards: filteredServiceCards,
    },
    {
      serviceHeading: "Proposal",
      serviceDeals: 3,
      serviceAmount: 2500,
      headerColor: "#0071CA",
      cards: filteredServiceCards,
    },
    {
      serviceHeading: "Won",
      serviceDeals: 3,
      serviceAmount: 2500,
      headerColor: "#00A353",
      cards: filteredServiceCards,
    },
    {
      serviceHeading: "On Hold",
      serviceDeals: 3,
      serviceAmount: 2500,
      headerColor: "#FFAA2C",
      cards: filteredServiceCards,
    },
  ];

  const createServiceColumn = (column) => {
    return (
      <div className="card-container">
        <div
          className="card-header"
          style={{ background: `${column.headerColor}` }}
        >
          {column.serviceHeading}
        </div>
        <div className="card-subheader">
          <span>{column.serviceDeals} deals</span>
          <span>{column.serviceAmount}</span>
        </div>
        <div className="card-cards">
          {column.cards.map((card) => {
            return createServiceCard(card);
          })}
        </div>
      </div>
    );
  };

  const createServiceCard = (card) => {
    return (
      <AdvancedCard type={"s-card"}>
        <div className="service-card-top">
          <span className="service-name">{card.serviceName}</span>
          <span className="service-status">{card.status}</span>
        </div>
        <div className="service-card-middle">
          <span className="service-amount">₹{card.serviceAmount}</span>
          <span className="service-number-of-tasks">
            {card.numberOfTasks > 0 ? card.numberOfTasks : "No"} task
          </span>
        </div>
        <div className="service-card-bottom">
          <span className="service-task-assigned-to">
            {card.taskAssignedTo}
          </span>
          {card.taskDueDays > 0 && (
            <span className="service-task-due-days">
              Task due in {card.taskDueDays} days{" "}
            </span>
          )}
        </div>
      </AdvancedCard>
    );
  };
  const handleServiceSearch = (e) => {
    console.log(e.target.value);
    setSearchText(e.target.value);
  };
  const handleFilterCards = () => {
    let filterCards = serviceCardDetails.filter((item) =>
      item.serviceName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredServiceCards(filterCards);
  };

  useEffect(() => {
    handleFilterCards();
  }, [searchText]);

  console.log(searchText);
  return (
    <PageContent
      title="Deals Overview"
      titleIsBreadCrumb
      breadCrumbData={["Home", "CRM", "Deals"]}
      titleActionContent={
        <Button
          onClick={() =>
            navigate("/crm/createForm", {
              state: {
                title: "Create Lead",
                api: "Create lead api",
                infoTitle: "Lead Info",
              },
            })
          }
          isSuccess
        >
          Create Deal
        </Button>
      }
    >
      <div className="deals-overview-wrapper">
        <div className="deals-overview-summary-card">
          <AdvancedCard type={"s-card"}>
            {dealsSummary.map((deal) => (
              <div className="summary-card-container">
                <h5 className="container-heading">{deal.heading}</h5>
                <h5
                  className="container-value"
                  style={{ color: `${deal.color}` }}
                >
                  {deal.value}
                </h5>
              </div>
            ))}
          </AdvancedCard>
        </div>
        <div className="m-t-20" />
        <div className="deals-overview-details-card">
          <AdvancedCard type={"s-card"}>
            <div className="services-search-container">
              <div className="field">
                <Input
                  onChange={(e) => handleServiceSearch(e)}
                  type={"text"}
                  placeholder={"Search"}
                  hasIcon
                  iconType={"search"}
                  value={searchText}
                />
              </div>
            </div>
            <div className="service-containers">
              {serviceColumns.map((column) => {
                return createServiceColumn(column);
              })}
            </div>
          </AdvancedCard>
        </div>
      </div>
    </PageContent>
  );
};

export default DealsOverview;

import React, { useEffect, useState } from "react";
import PageContent from "../../shared/components/pageContent/PageContent";
import { FeatherIcon } from "../../shared/featherIcon/FeatherIcon";
import { AdvancedCard } from "../../shared/components/cards/AdvancedCard";
import carousel1 from "../../../assets/groflex/images/carousel1.png";
import ReactSlickCarousel from "../../shared/components/carousel/ReactSlickCarousel";
import banner1 from "../../../assets/groflex/images/home/banner1.png";
import banner2 from "../../../assets/groflex/images/home/banner2.png";
import banner3 from "../../../assets/groflex/images/home/banner3.png";
import banner4 from "../../../assets/groflex/images/home/banner4.png";
import commingSoon from "../../../assets/groflex/images/home/coming-soon.png";
import { Button } from "../../shared/components/button/Button";
import supplychainManagement from "../../../assets/groflex/images/home/supplychain-management.png";
import ecommerce from "../../../assets/groflex/images/home/ecommerce.png";
import pos from "../../../assets/groflex/images/home/pos.png";
import crmBanner from "../../../assets/groflex/images/home/crm.png";
import { useNavigate } from "react-router-dom";
import KanbanBoard from "../../shared/components/kanbanBoard/KanbanBoard";
import groflexService from "../../services/groflex.service";
import config from "../../../../newConfig";
import { useSelector } from "react-redux";
import NewSubscriptionPlanModal from "./NewSubscriptionPlanModal";
import chargebeePlanEnum from "../../enums/chargebee-plan.enum";

const Home = () => {
  const { subscriptionData, hasNewSubscriptionModalOpened } = useSelector(
    (state) => state.accountData
  );

  const navigate = useNavigate();
  const [isEditableDisabled, setIsEditableDisbaled] = useState(true);
  const [lastViewedDocuments, setLastViewedDocuments] = useState([]);
  const [lastViewedCustomers, setLastViewedCustomers] = useState([]);
  const [isModalActive, setIsModalActive] = useState(false);

  const [board, setBoard] = useState({});
  useEffect(() => {
    fetchQuickLinks();
    fetchLastViewedDocumentsAndCustomers();
    if (
      (subscriptionData?.planId === chargebeePlanEnum.FREE_PLAN ||
        subscriptionData?.planId === chargebeePlanEnum.ACCOUNTING_TRIAL_PLAN) &&
      !hasNewSubscriptionModalOpened
    ) {
      openNewSubscriptionPlanModal();
    }
  }, []);

  const fetchQuickLinks = () => {
    groflexService
      .request(`${config.resourceUrls.quickLinks}`, { auth: true })
      .then((res) => {
        let linksOrder = [];
        let kanbanTasks = {};

        res.body.data.links.forEach((item) => {
          let quickLinkEntry = item.linkId;
          linksOrder.push(quickLinkEntry);
          kanbanTasks[item.linkId] = {
            id: item.linkId,
            content: (
              <div
                className="quick-link-card"
                onClick={() => navigate(setQuickLinksUrl(item.linkId))}
              >
                <FeatherIcon name={"Inbox"} size={25} color="#272d30" />
                <p className="quick-link-text">
                  {item.linkId
                    .split("-")
                    .join(" ")
                    .replace(
                      /(^|\s)([a-z])/g,
                      (_, space, letter) => space + letter.toUpperCase()
                    )}
                </p>
              </div>
            ),
          };
        });

        setBoard({
          tasks: kanbanTasks,
          columns: {
            column1: {
              id: "column1",
              title: "",
              taskIds: linksOrder,
            },
          },
          columnOrder: ["column1"],
        });
      });
  };

  const setQuickLinksOrder = () => {
    let payload = [];
    board.columns.column1.taskIds.forEach((item, id) => {
      let link = setQuickLinksUrl(item);
      payload.push({
        link: link,
        linkId: item,
        name: item
          .split("-")
          .join(" ")
          .replace(
            /(^|\s)([a-z])/g,
            (_, space, letter) => space + letter.toUpperCase()
          ),
        order: id,
      });
    });

    groflexService
      .request(`${config.resourceUrls.quickLinks}`, {
        auth: true,
        data: payload,
        method: "PUT",
      })
      .then((res) => {});
  };
  const fetchLastViewedDocumentsAndCustomers = () => {
    groflexService
      .request(`${config.resourceUrls.lastViewedDocumentsAndCustomers}`, {
        auth: true,
      })
      .then((res) => {
        setLastViewedCustomers(res.body.data.lastUsedCustomers);
        setLastViewedDocuments(res.body.data.lastUsedDocuments);
      });
  };

  const setQuickLinksUrl = (quickLinkId) => {
    let url = "";
    switch (quickLinkId) {
      case "add-articles":
        url = "/articles";
        break;
      case "create-sales":
        url = "/sales/invoices";
        break;
      case "create-timesheets":
        url = "/sales/time-sheets";
        break;
      case "create-contacts":
        url = "/contacts";
        break;
      case "invite-users":
        url = "/teams";
        break;
      case "create-quotations":
        url = "/sales/quotations";
        break;
    }

    return url;
  };

  const handleSave = () => {
    setQuickLinksOrder();
    setIsEditableDisbaled(true);
  };

  const openNewSubscriptionPlanModal = () => {
    setIsModalActive(true);
  };

  return (
    <PageContent
      breadCrumbIcon={
        <FeatherIcon
          color="#272D30"
          name="Home"
          size={18}
          style={{ marginRight: "10px" }}
        />
      }
      breadCrumbData={["Home"]}
      title="Home page"
      loading={Object.keys(board).length === 0}
    >
      <NewSubscriptionPlanModal
        isModalActive={isModalActive}
        setIsModalActive={setIsModalActive}
      />
      <div className="home-wrapper">
        <ReactSlickCarousel settings={{ fade: false }}>
          <div className="welcome-container">
            <div
              className="welcome-sub-container banner-1"
              style={{
                backgroundImage: `url(${banner1})`,
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="welcome-content">
                <h2 className="welcome-content-heading">Welcome to Groflex!</h2>
                <span className="welcome-content-body">
                  Take a look to our Quick Start Guide below and learn how to
                  unlock the potential of Groflex.
                </span>
              </div>
            </div>
          </div>

          <div className="welcome-container">
            <div
              className="welcome-sub-container banner-2"
              style={{
                backgroundImage: `url(${banner2})`,
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="welcome-content">
                <h2 className="welcome-content-heading">Smart Dashboard</h2>
                <span className="welcome-content-body">
                  Get a quick overview of your day to day business activities at
                  a glance.
                </span>
                <Button
                  isSuccess
                  isOutlined
                  className={"dashboard-button"}
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>

          <div className="welcome-container">
            <div
              className="welcome-sub-container banner-3"
              style={{
                backgroundImage: `url(${banner3})`,
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="welcome-content">
                <h2 className="welcome-content-heading">
                  Create professional invoices
                </h2>
                <span className="welcome-content-body">
                  Create customized invoices and automate your routing billing
                  operations .
                </span>
                <Button
                  isSuccess
                  isOutlined
                  className={"invoices-button"}
                  onClick={() => navigate("/sales/invoices")}
                >
                  Create invoice
                </Button>
              </div>
            </div>
          </div>

          <div className="welcome-container">
            <div
              className="welcome-sub-container banner-4"
              style={{
                backgroundImage: `url(${banner4})`,
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="welcome-content">
                <h2 className="welcome-content-heading">Invite your team</h2>
                <span className="welcome-content-body">
                  Invite your Accountant and Sales people to Groflex and save
                  time and effort in communications.
                </span>
                <Button
                  isSuccess
                  isOutlined
                  className={"teams-button"}
                  onClick={() => navigate("/teams")}
                >
                  Invite team
                </Button>
              </div>
            </div>
          </div>
        </ReactSlickCarousel>

        <AdvancedCard type={"s-card"} className={"home-quick-links-wrapper"}>
          <div className="quick-links-header">
            <h3 className="home-quick-links">Quick Links</h3>
            {isEditableDisabled ? (
              <div
                className="quick-links-edit-container"
                onClick={() => setIsEditableDisbaled(false)}
              >
                <h5>Edit Links</h5>
                <FeatherIcon name={"Edit"} size={20} color="#00A353" />
              </div>
            ) : (
              <div
                className="quick-links-edit-container"
                onClick={() => handleSave()}
              >
                <h5>Save</h5>
                <FeatherIcon name={"Check"} size={20} color="#00A353" />
              </div>
            )}
            {/* <div
                className="quick-links-edit-container"
                onClick={() => setIsEditableDisbaled(false)}
              >
                <h5>Edit Links</h5>
                <FeatherIcon name={"Edit"} size={20} color="#00A353" />
              </div> */}
          </div>

          <div
            className={`home-quick-links-container ${
              isEditableDisabled ? "default-view" : "edit-view"
            }`}
          >
            <KanbanBoard
              isDragDisabled={isEditableDisabled}
              direction={"horizontal"}
              board={board}
              setBoard={setBoard}
            />
          </div>
        </AdvancedCard>

        <AdvancedCard type={"s-card"}>
          <div className="coming-soon-card">
            <div className="coming-soon-content">
              <h3 className="coming-soon-heading">Coming Soon...!</h3>
              <img
                src={commingSoon}
                alt="CommingSoon"
                className="coming-soon-image"
              />
            </div>
            <div className="coming-soon-carousel">
              <ReactSlickCarousel settings={{ fade: false }}>
                <div className="carousel-wrapper">
                  <div className="carousel-image-container">
                    <img
                      style={{
                        width: "295px",
                        height: "218px",
                      }}
                      src={supplychainManagement}
                      alt="carousel1"
                    />
                  </div>

                  <div className="carousel-content">
                    <h2 className="carousel-content-heading">
                      Suplay Chain Management
                    </h2>
                    <p className="carousel-content-body">
                      Track your inventory levels to avoid running out of stock
                      and overstock.
                    </p>
                    <p className="carousel-content-body">
                      Track your inventory levels to avoid running out of stock
                      and overstock.
                    </p>
                  </div>
                </div>

                <div className="carousel-wrapper">
                  <div className="carousel-image-container">
                    <img
                      style={{
                        width: "295px",
                        height: "218px",
                      }}
                      src={ecommerce}
                      alt="carousel1"
                    />
                  </div>

                  <div className="carousel-content">
                    <h2 className="carousel-content-heading">E-commerce</h2>
                    <p className="carousel-content-body">
                      Expand your market at global scale!
                    </p>
                    <p className="carousel-content-body">
                      Our E-comerce platform will provide will offer a fast
                      payment processes, store management, integrate data
                      consolidation, and analytic reports of customer behaviour
                      and preferences.
                    </p>
                  </div>
                </div>

                <div className="carousel-wrapper">
                  <div className="carousel-image-container">
                    <img
                      style={{
                        width: "295px",
                        height: "218px",
                      }}
                      src={pos}
                      alt="carousel1"
                    />
                  </div>

                  <div className="carousel-content">
                    <h2 className="carousel-content-heading">
                      Point of Sales (PoS) - Billing Systems
                    </h2>
                    <p className="carousel-content-body">
                      Ensure that you're getting paid on time and in full.
                    </p>
                    <p className="carousel-content-body">
                      Organize all your processes better by managing article
                      databases on mobile and desktop P.O.S system. Improve your
                      cash flow and customers relationships.
                    </p>
                  </div>
                </div>

                <div className="carousel-wrapper">
                  <div className="carousel-image-container">
                    <img
                      style={{
                        width: "295px",
                        height: "218px",
                      }}
                      src={pos}
                      alt="carousel1"
                    />
                  </div>

                  <div className="carousel-content">
                    <h2 className="carousel-content-heading">
                      Customer Relationship Management (CRM)
                    </h2>
                    <p className="carousel-content-body">
                      Manage your relationship with your clients and
                      professionally with our CRM features.
                    </p>
                    <p className="carousel-content-body">
                      Groflex provides you CRM analytics, contact management,
                      and reporting that can be customized based on your
                      necessities.
                    </p>
                  </div>
                </div>

                <div className="carousel-wrapper">
                  <div className="carousel-image-container">
                    <img
                      style={{
                        width: "295px",
                        height: "218px",
                      }}
                      src={pos}
                      alt="carousel1"
                    />
                  </div>

                  <div className="carousel-content">
                    <h2 className="carousel-content-heading">
                      Human Resources Management (HRM)
                    </h2>
                    <p className="carousel-content-body">
                      Use our HRM tool to improve your employee engagement for
                      better performance and decision-making.
                    </p>
                    <p className="carousel-content-body">
                      Centralize your employee's attendance tracking, payroll
                      processing, performance management, employee engagement
                      and more in our platform.
                    </p>
                  </div>
                </div>
              </ReactSlickCarousel>
            </div>
          </div>
        </AdvancedCard>
        <AdvancedCard type={"s-card"} className={"home-recent-activites"}>
          <h3 className="recent-activities-heading">Recently Used</h3>
          <div className="recent-activies-container">
            <div className="recent-documents">
              {lastViewedDocuments.map((document, id) => (
                <div
                  className={"recent-activites-entry"}
                  key={`document-${id}`}
                >
                  <div className="recent-entry-header">
                    <div className="recent-title">{document.state}</div>
                    <div className="recent-number">{document.number}</div>
                  </div>
                  <div className="recent-entry-content">
                    <div className="recent-title">{document.name}</div>
                    <div className="recent-number">{document.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="recent-activities-divider"></div>
            <div className="recent-customers-container">
              {lastViewedCustomers.map((customer, id) => (
                <div className="recent-customer" key={`customer-${id}`}>
                  <div className="initials">{customer.initials}</div>
                  <div className="full-name">{customer.name}</div>
                </div>
              ))}
            </div>
          </div>
        </AdvancedCard>
      </div>
    </PageContent>
  );
};

export default Home;

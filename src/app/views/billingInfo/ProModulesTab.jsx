import React, { useEffect, useState } from "react";
import { AdvancedCard } from "../../shared/components/cards/AdvancedCard";
import groflexService from "../../services/groflex.service";
import oldConfig from "../../../../oldConfig";
import FontAwesomeIcon from "../../shared/fontAwesomeIcon/FontAwesomeIcon";

const ProModulesTab = () => {
  const [planType, setPlanType] = useState("");
  useEffect(() => {
    fetchSubscriptionDetail();
  }, []);
  const fetchSubscriptionDetail = () => {
    groflexService
      .request(`${oldConfig.settings.endpoints.getSubscriptionDetails}`, {
        auth: true,
      })
      .then((res) => {
        if (res && res.body.data) {
          setPlanType(res.body.data.planId);
        }
      });
  };

  return (
    <div className="pro-modules-tab-warpper">
      <div className="columns is-multiline">
        <div className="column is-6">
          <AdvancedCard type={"s-card"} className={"plan-card-body"}>
            <div
              className={`${
                planType === "Free_Plan" ? "selected-plan" : "not-selected"
              }`}
            >
              {planType === "Free_Plan" ? "Your current plan" : "Free plan"}
            </div>
            <div className="plan-name">
              <h2 style={{ fontSize: "36px", fontWeight: "600" }}>Free</h2>
              <h2
                style={{
                  fontSize: "20px",
                  color: "#C6C6C6",
                  fontWeight: "600",
                }}
              >
                Forever
              </h2>
            </div>
            <h3>This Feature includes:</h3>
            <div className="plan-description">
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>10 user limit</span>
              </div>
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>Timesheet invoicing</span>
              </div>
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>Quotations</span>
              </div>
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>Digital Payments</span>
              </div>
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>Recurring invoices</span>
              </div>
            </div>
          </AdvancedCard>
        </div>
        <div className="column is-6">
          <AdvancedCard type={"s-card"} className={"plan-card-body"}>
            <div
              className={`${
                planType === "Accounting_Yearly_Plan"
                  ? "selected-plan"
                  : "not-selected"
              }`}
            >
              {planType === "Accounting_Yearly_Plan"
                ? "Your current plan"
                : "Most popular"}
            </div>
            <div className="plan-name">
              <h2 style={{ fontSize: "36px", fontWeight: "600" }}>
                Accounting
              </h2>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>
                ₹43.25/Month (Billed Yearly)
              </h2>
            </div>
            <h3>This Feature includes:</h3>
            <div className="plan-description">
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>Free Trial 14 days</span>
              </div>
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>Bank Reconciliation</span>
              </div>
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>Expense Tracking</span>
              </div>
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>Accounts Payable</span>
              </div>
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>General Ledger</span>
              </div>
            </div>
          </AdvancedCard>
        </div>
      </div>
      <div className="columns is-mutliline">
        <div className="column is-6">
          <AdvancedCard type={"s-card"} className={"plan-card-body"}>
            <div className={`not-selected`} style={{ background: "#F2F2F2" }}>
              More Plan
            </div>
            <div className="plan-name">
              <h2
                style={{
                  fontSize: "36px",
                  color: "#C6C6C6",
                  fontWeight: "600",
                }}
              >
                COMING
              </h2>
              <h2
                style={{
                  fontSize: "36px",
                  color: "#C6C6C6",
                  fontWeight: "600",
                }}
              >
                SOON
              </h2>
            </div>

            <div className="plan-description">
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>Inventory Trading</span>
              </div>
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>Point of Sales</span>
              </div>
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>Inventory Manufacturer</span>
              </div>
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>E-Commerce</span>
              </div>
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>CRM</span>
              </div>
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>HRM</span>
              </div>
              <div>
                <FontAwesomeIcon
                  name={"circle-check"}
                  color={"#00a353"}
                  size={15}
                />
                <span>SCM</span>
              </div>
            </div>
          </AdvancedCard>
        </div>
      </div>
    </div>
  );
};

export default ProModulesTab;

import React, { useEffect, useState } from "react";
import { AdvancedCard } from "../../shared/components/cards/AdvancedCard";
import groflexService from "../../services/groflex.service";
import oldConfig from "../../../../oldConfig";
import FontAwesomeIcon from "../../shared/fontAwesomeIcon/FontAwesomeIcon";
import { Button } from "../../shared/components/button/Button";
import chargebeePlanEnum from "../../enums/chargebee-plan.enum";
import { redirectToChargebee } from "../../helpers/redirectToChargebee";
import { Switch } from "../../shared/components/switch/Switch";
import moment from "moment";

const ProModulesTab = ({ planDetails }) => {
  const [planPriceYearly, setPlanPriceYearly] = useState(false);
  const onBuyClick = (portal) => {
    let plan = chargebeePlanEnum.ACCOUNTING_YEARLY_PLAN;

    if (portal) {
      redirectToChargebee(plan, false);
    }
  };

  const onTryForFreeClick = (portal) => {
    let plan = chargebeePlanEnum.ACCOUNTING_TRIAL_PLAN;

    if (portal) {
      redirectToChargebee(plan, false);
    }
  };
  const handlePlanPriceChange = (e) => {
    const checked = e.target.checked;
    setPlanPriceYearly(checked);
  };

  const FreePlanCard = () => {
    return (
      <AdvancedCard
        type={"s-card"}
        className={"plan-card-body"}
        style={{
          height: planDetails.planId === chargebeePlanEnum.FREE_PLAN && "559px",
        }}
      >
        <div
          className={`${
            planDetails.planId === "Free_Plan"
              ? "selected-plan"
              : "not-selected"
          }`}
        >
          {planDetails.planId === "Free_Plan"
            ? "Your current plan"
            : "Free plan"}
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
        <h3 style={{ paddingTop: chargebeePlanEnum.FREE_PLAN ? "30px" : "" }}>
          This Feature includes:
        </h3>
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
    );
  };

  const AccountingPlanCard = () => {
    return (
      <AdvancedCard
        type={"s-card"}
        className={"plan-card-body"}
        style={{
          height:
            planDetails.planId === chargebeePlanEnum.ACCOUNTING_YEARLY_PLAN
              ? "460px"
              : "",
        }}
      >
        <div
          style={{
            paddingTop:
              planDetails.planId === chargebeePlanEnum.ACCOUNTING_YEARLY_PLAN ||
              planDetails.planId === chargebeePlanEnum.ACCOUNTING_TRIAL_PLAN
                ? "30px"
                : "",
            paddingBottom:
              planDetails.planId === chargebeePlanEnum.ACCOUNTING_YEARLY_PLAN ||
              planDetails.planId === chargebeePlanEnum.ACCOUNTING_TRIAL_PLAN
                ? "30px"
                : "",
          }}
          className={`${
            planDetails.planId === chargebeePlanEnum.ACCOUNTING_YEARLY_PLAN
              ? "selected-plan"
              : planDetails.planId === chargebeePlanEnum.ACCOUNTING_TRIAL_PLAN
              ? "selected-plan"
              : "not-selected"
          }`}
        >
          {planDetails.planId === chargebeePlanEnum.ACCOUNTING_YEARLY_PLAN
            ? `Your current plan \n(ends on ${moment(
                planDetails.currentTermEnd
              ).format("LL")})`
            : planDetails.planId === chargebeePlanEnum.ACCOUNTING_TRIAL_PLAN
            ? `Accounting trial active \n (ends on ${moment(
                planDetails.currentTermEnd
              ).format("LL")})`
            : "Most popular"}
        </div>
        <div className="plan-name">
          <h2 style={{ fontSize: "36px", fontWeight: "600" }}>Accounting</h2>
          <Switch
            isSuccess
            checked={planPriceYearly}
            onChange={handlePlanPriceChange}
            name="planPriceYearly"
          />
          <h2 style={{ fontSize: "20px", fontWeight: "600" }}>
            {planPriceYearly
              ? "₹5999/Year (Billed Yearly)"
              : "₹499/Month (Billed Yearly)"}
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
        {(planDetails.planId === chargebeePlanEnum.FREE_PLAN ||
          planDetails.planId === chargebeePlanEnum.ACCOUNTING_TRIAL_PLAN) && (
          <div style={{ padding: "20px", paddingBottom: "0" }}>
            <div className="column is-12">
              <Button
                isPrimary
                className={"column is-12"}
                onClick={() => onBuyClick(true)}
              >
                Buy
              </Button>
            </div>
          </div>
        )}

        {planDetails.planId === chargebeePlanEnum.FREE_PLAN && (
          <div style={{ padding: "20px", paddingTop: "0" }}>
            <div className="column is-12">
              <Button
                isSecondary
                className={"column is-12"}
                onClick={() => onTryForFreeClick(true)}
              >
                Try for free
              </Button>
            </div>
          </div>
        )}
      </AdvancedCard>
    );
  };

  const ComingSoonCard = () => {
    return (
      <AdvancedCard
        type={"s-card"}
        className={"plan-card-body"}
        style={{
          height:
            planDetails.planId === chargebeePlanEnum.FREE_PLAN
              ? "559px"
              : "460px",
        }}
      >
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

        <h3
          style={{ paddingTop: chargebeePlanEnum.FREE_PLAN ? "5px" : "25px" }}
        >
          New features coming
        </h3>
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
    );
  };

  return (
    <div className="pro-modules-tab-warpper">
      <div className="columns is-multiline">
        <div className="column is-4">
          {planDetails?.planName === chargebeePlanEnum.FREE_PLAN ? (
            <FreePlanCard />
          ) : (
            <AccountingPlanCard />
          )}
        </div>
        <div className="column is-4">
          {planDetails?.planName === chargebeePlanEnum.FREE_PLAN ? (
            <AccountingPlanCard />
          ) : (
            <ComingSoonCard />
          )}
        </div>
        <div className="column is-4">
          {planDetails?.planName === chargebeePlanEnum.FREE_PLAN && (
            <ComingSoonCard />
          )}
        </div>
      </div>
      <div className="columns is-mutliline"></div>
    </div>
  );
};

export default ProModulesTab;

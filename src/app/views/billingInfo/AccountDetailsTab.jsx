import React, { useEffect, useState } from "react";
import { AdvancedCard } from "../../shared/components/cards/AdvancedCard";
import { FeatherIcon } from "../../shared/featherIcon/FeatherIcon";
import FontAwesomeIcon from "../../shared/fontAwesomeIcon/FontAwesomeIcon";
import groflexService from "../../services/groflex.service";
import oldConfig from "../../../../oldConfig";
import moment from "moment";
import chargebeePlanEnum from "../../enums/chargebee-plan.enum";

const AccountDetailsTab = ({ planDetails }) => {
  const [subscriptionDetails, setSubscriptionDetails] = useState({
    startDate: "",
    endDate: "",
    subscriptionRemaining: {
      percentage: 0,
      color: "",
    },
    currentPlan: "",
  });
  useEffect(() => {
    getPlanDetails(planDetails);
  }, []);

  const getPlanDetails = (subscriptionDetail) => {
    let subscriptionDatePercentage = 0;
    let subscriptionDateColor = "";
    let currentPlan = "Free_Plan";
    let currentTermStart;
    let currentTermEnd;
    let currentDate;
    let totalDays;
    let remainingDays;
    if (subscriptionDetail.planName === "Free_Plan") {
      currentPlan = "Free plan";
      const hours = moment().hours();
      const minutes = moment().minutes();
      const totalHours = 24;

      const remain = hours + minutes / 60;
      subscriptionDatePercentage = 100 - ((totalHours - remain) / 24) * 100;
      subscriptionDateColor = "#0071CA";
    } else if (subscriptionDetail.planName === "Accounting_Yearly_Plan") {
      currentPlan = "Accounting yearly plan";
      subscriptionDateColor = "#00a353";
      currentTermStart = moment(subscriptionDetail.currentTermStart);
      currentTermEnd = moment(subscriptionDetail.currentTermEnd);
      currentDate = moment();
      totalDays = currentTermEnd.diff(currentTermStart, "days");
      remainingDays = currentDate.diff(currentTermStart, "days");
      subscriptionDatePercentage = (remainingDays / totalDays) * 100;
      if (subscriptionDatePercentage > 100) {
        subscriptionDatePercentage = 100;
        subscriptionDateColor = "#F03636";
      } else if (
        subscriptionDatePercentage > 85 &&
        subscriptionDatePercentage < 99
      ) {
        subscriptionDateColor = "#dd7474";
      }
    } else if (
      subscriptionDetail.planName === chargebeePlanEnum.ACCOUNTING_TRIAL_PLAN
    ) {
      currentPlan = "Accounting trial plan";
      subscriptionDateColor = "#00a353";
      currentTermStart = moment(subscriptionDetail.currentTermStart);
      currentTermEnd = moment(subscriptionDetail.currentTermEnd);
      currentDate = moment();
      totalDays = currentTermEnd.diff(currentTermStart, "days");
      remainingDays = currentDate.diff(currentTermStart, "days");
      subscriptionDatePercentage = (remainingDays / totalDays) * 100;
      if (subscriptionDatePercentage > 100) {
        subscriptionDatePercentage = 100;
        subscriptionDateColor = "#F03636";
      } else if (
        subscriptionDatePercentage > 85 &&
        subscriptionDatePercentage < 99
      ) {
        subscriptionDateColor = "#dd7474";
      }
    }
    setSubscriptionDetails({
      ...subscriptionDetails,
      startDate:
        subscriptionDetail.planName === "Free_Plan"
          ? moment().format("LL")
          : moment(subscriptionDetail.currentTermStart).format("LL"),
      endDate:
        subscriptionDetail.planName === "Free_Plan"
          ? moment().format("LL")
          : moment(subscriptionDetail.currentTermEnd).format("LL"),
      subscriptionRemaining: {
        percentage: subscriptionDatePercentage,
        color: subscriptionDateColor,
      },
      currentPlan: currentPlan,
    });
  };

  const subscriptionEndText = () => {
    let endText = "";
    switch (planDetails.planName) {
      case chargebeePlanEnum.ACCOUNTING_TRIAL_PLAN:
        endText = `Your free trial ends on ${subscriptionDetails.endDate}`;
        break;
      case chargebeePlanEnum.FREE_PLAN:
        endText = "";
        break;
      case chargebeePlanEnum.ACCOUNTING_YEARLY_PLAN:
        endText = `Your next payment will be on ${subscriptionDetails.endDate}`;
        break;
    }
    return endText;
  };

  const iconColor =
    subscriptionDetails.currentPlan === "Free plan" ? "#0071ca" : "#00a353";

  return (
    <div className="billing-info-account-details-tab">
      <AdvancedCard type={"s-card"}>
        <h2 className="title is-5 is-bold">Your plan</h2>
        <h2
          className="is-bold"
          style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "500" }}
        >
          {subscriptionDetails.currentPlan}
        </h2>
        <h2 style={{ marginBottom: "10px", fontSize: "15px" }}>
          {subscriptionDetails.currentPlan === "Free plan"
            ? "Your one-stop solution for all your accounting needs ! Here’s what you will get in the accounting module."
            : "You can now access these premium features"}
        </h2>
        <div className="subscription-plan-contents">
          <div>
            <FontAwesomeIcon
              name={"circle-check"}
              color={iconColor}
              size={15}
            />
            <span>Cash And Bank</span>
          </div>
          <div>
            <FontAwesomeIcon
              name={"circle-check"}
              color={iconColor}
              size={15}
            />
            <span>Transactions</span>
          </div>
          <div>
            <FontAwesomeIcon
              name={"circle-check"}
              color={iconColor}
              size={15}
            />
            <span>Chart of Accounts</span>
          </div>
          <div>
            <FontAwesomeIcon
              name={"circle-check"}
              color={iconColor}
              size={15}
            />
            <span>Bank Reconciliation</span>
          </div>
          <div>
            <FontAwesomeIcon
              name={"circle-check"}
              color={iconColor}
              size={15}
            />
            <span>Cash Flow</span>
          </div>
        </div>

        <div className="plan-time-period">
          <span>Start Date: {subscriptionDetails.startDate}</span>
          <span>End Date: {subscriptionDetails.endDate}</span>
        </div>
        <div className="subscription-quota-bar">
          <div
            className="subscription-quota-used"
            style={{
              width: `${subscriptionDetails.subscriptionRemaining.percentage}%`,
              background: subscriptionDetails.subscriptionRemaining.color,
            }}
          ></div>
        </div>
        {subscriptionEndText()}
      </AdvancedCard>
      <AdvancedCard type={"scard"}></AdvancedCard>
    </div>
  );
};

export default AccountDetailsTab;

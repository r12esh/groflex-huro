import React, { useEffect, useState } from "react";
import PageContent from "../../shared/components/pageContent/PageContent";
import Tabs from "../../shared/components/tabs/Tabs";
import AccountDetailsTab from "./AccountDetailsTab";
import ProModulesTab from "./ProModulesTab";
import groflexService from "../../services/groflex.service";
import oldConfig from "../../../../oldConfig";
import { updateSubscriptionDetails } from "../../helpers/updateSubsciptionDetails";
import { useLocation } from "react-router-dom";

const BillingInfo = () => {
  const location = useLocation();
  useEffect(() => {
    fetchSubscriptionDetail();
  }, []);
  const [planType, setPlanType] = useState("");
  const [loading, setLoading] = useState(true);
  const [planDetails, setPlanDetails] = useState({});
  const fetchSubscriptionDetail = () => {
    groflexService
      .request(`${oldConfig.settings.endpoints.getSubscriptionDetails}`, {
        auth: true,
      })
      .then((res) => {
        if (res && res.body.data) {
          setPlanDetails(res.body.data);
          setPlanType(res.body.data.planId);
          setLoading(false);
        }
      });
  };

  updateSubscriptionDetails();
  const billingTabList = [
    {
      label: "Account Details",
      content: <AccountDetailsTab planDetails={planDetails} />,
    },
    {
      label: "Pro Modules",
      content: <ProModulesTab planDetails={planDetails} />,
    },
  ];

  return (
    <PageContent title={"Your billing"} loading={loading}>
      <div className="billing-info-wrapper">
        <Tabs
          tabList={billingTabList}
          initialTab={
            location?.state?.initialTab ? location?.state?.initialTab : 0
          }
        />
      </div>
    </PageContent>
  );
};

export default BillingInfo;

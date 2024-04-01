import React, { useState } from "react";
import PageContent from "../../shared/components/pageContent/PageContent";
import Tabs from "../../shared/components/tabs/Tabs";
import AccountDetailsTab from "./AccountDetailsTab";
import ProModulesTab from "./ProModulesTab";

const BillingInfo = () => {
  const billingTabList = [
    {
      label: "Account Details",
      content: <AccountDetailsTab />,
    },
    { label: "Pro Modules", content: <ProModulesTab /> },
  ];
  return (
    <PageContent title={"Your billing"}>
      <div className="billing-info-wrapper">
        <Tabs tabList={billingTabList} />
      </div>
    </PageContent>
  );
};

export default BillingInfo;

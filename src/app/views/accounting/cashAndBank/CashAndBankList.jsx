import React from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import BankListComponent from "./BankListComponent";
import CashListComponent from "./CashListComponent";

const CashAndBank = () => {
  return <PageContent title="Cash and Bank">
    <BankListComponent />
    <CashListComponent />
  </PageContent>;
};

export default CashAndBank;

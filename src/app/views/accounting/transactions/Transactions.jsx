import React, { useEffect, useState } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { useNavigate } from "react-router-dom";
import config from "../../../../../newConfig";
import { ListAdvancedDefaultSettings } from "../../../helpers/constants";
import { CustomShowHeaderSum } from "../../../shared/components/list-advanced/CustomShowHeaderSum";
import { ListAdvancedComponent } from "../../../shared/components/list-advanced/ListAdvancedComponent";
import { formatCurrency } from "../../../helpers/formatCurrency";
import { Button } from "../../../shared/components/button/Button";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";
import {
  dateCompareSort,
  localeCompare,
} from "../../../helpers/sortComparators";
import groflexService from "../../../services/groflex.service";
import DropDownButton from "../../../shared/components/button/dropDownButton/DropDownButton";
import MoneyInModal from "./MoneyInModal";

const actions = [{ name: "Delete", icon: "edit" }];
const reconcile = (p) => {
  console.log(p);
  return <>{p.val ? "Reconcile" : "Not reconcile"}</>;
};

const Transactions = () => {
  const [isMoneyInActive, setIsMoneyInActive] = useState(false);

  const [modalTitle, setModalTitle] = useState("");
  const navigate = useNavigate();
  return (
    <PageContent
      title="Transactions"
      titleActionContent={
        <DropDownButton
          buttonTitle={"New Transactions"}
          dropDownItems={[
            {
              title: "Money In",
              action: () => {
                setModalTitle("Money_In"), setIsMoneyInActive(true);
              },
            },
            {
              title: "Money Out",
              action: () => {
                setModalTitle("Money_Out"), setIsMoneyInActive(true);
              },
            },
            {
              title: "Sales Income",
              action: () => navigate("/sales/invoices"),
            },
            {
              title: "Purchase",
              action: () => navigate("/expneses/new"),
            },
            {
              title: "Expenses",
              action: () => navigate("/expnese/new"),
            },
          ]}
        />
      }
    >
      <MoneyInModal
        isMoneyInActive={isMoneyInActive}
        setIsMoneyInActive={setIsMoneyInActive}
        modalTitle={modalTitle}
      />

      <ListAdvancedComponent
        // onRowClicked={(e) => {
        //   navigate(`/articles/${e.data.id}`);
        // }}
        //onActionClick={handleActionClick}
        columnDefs={[
          {
            headerName: "Date",
            field: "date",
            filter: true,
            comparator: (date1, date2) =>
              dateCompareSort(date1, date2, config.dateFormat.client),
          },
          {
            field: "chartOfAccount.accountName",
            headerName: "account name",
          },

          { field: "bankDetail.bankName", headerName: "payment method" },

          {
            field: "debits",
            headerName: "Debit",
            cellClass: ListAdvancedDefaultSettings.EXCEL_STYLE_IDS.Currency,
            valueFormatter: (evt) => {
              return formatCurrency(evt.value);
            },
          },
          {
            field: "credits",
            headerName: "Credit",
            cellClass: ListAdvancedDefaultSettings.EXCEL_STYLE_IDS.Currency,
            valueFormatter: (evt) => {
              return formatCurrency(evt.value);
            },
          },
          {
            field: "balance",
            headerName: "balance",
            cellClass: ListAdvancedDefaultSettings.EXCEL_STYLE_IDS.Currency,
            valueFormatter: (evt) => {
              return formatCurrency(evt.value);
            },
          },
          {
            field: "reconcileStatus",
            headerName: "Reconcile Status",
            cellRenderer: reconcile,
          },
          { field: "sourceType", headerName: "Source" },
        ]}
        fetchUrl={config.resourceUrls.transaction}
        actionMenuData={actions}
      />
    </PageContent>
  );
};

export default Transactions;

import React, { useEffect } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { useNavigate } from "react-router-dom";
import config from "../../../../../config";
import { ListAdvancedDefaultSettings } from "../../../helpers/constants";
import { CustomShowHeaderSum } from "../../../shared/components/list-advanced/CustomShowHeaderSum";
import { ListAdvancedComponent } from "../../../shared/components/list-advanced/ListAdvancedComponent";
import { formatCurrency } from "../../../helpers/formatCurrency";
import { Button } from "../../../shared/components/button/Button";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";
import { dateCompareSort, localeCompare } from "../../../helpers/sortComparators";
import groflexService from "../../../services/groflex.service";




const actions = [
  { name:"Delete", icon: "edit" },
 
];
const reconcile=(p)=>{
console.log(p)
  return<>
  {p.val?"Reconcile":"Not reconcile"}
  </>
}


const Transactions = () => {

   // const navigate = useNavigate();
  //  const handleActionClick = (action, row, params) => {
  //   switch (action.name) {
  //     case "Delete":
  //       groflexService
  //         .request(`${config.resourceUrls.quotation}${row.id}`, {
  //           auth: true,
  //           method: "DELETE",
  //         })
  //         .then((res) => {
  //           if (res?.body?.message) {
  //             console.log(res, "Delete Failed");
  //           } else {
  //             params.api.applyTransaction({ remove: [row] });
  //             console.log(res, "Deleted Succesfullyyy");
  //           }
  //         });
  //       break;
  //     // case "Edit":
  //     //   navigate(`/article/edit/${row.id}`);
  //   }
  // };
  return (
  <PageContent title="Transactions"

titleActionContent={
      <Button isSuccess>
        Create recurring invoice
      </Button>}
      >
  
  
  <ListAdvancedComponent
        // onRowClicked={(e) => {
        //   navigate(`/article/${e.data.id}`);
        // }}
        //onActionClick={handleActionClick}
        columnDefs={[

          {
            headerName: "Date",
            field: "date",
            filter: true,
            comparator: (date1, date2) => dateCompareSort(date1, date2, config.dateFormat.client),
   
          },
          {
            field: "chartOfAccount.accountName",
            headerName: "account name",
          },
          
          { field: "bankDetail.bankName", headerName: "payment method" },
          
  
          { field: "debits", headerName: "Debit",
          cellClass: ListAdvancedDefaultSettings.EXCEL_STYLE_IDS.Currency,
          valueFormatter: (evt) => {
            return formatCurrency(evt.value);}
        },
          { field: "credits", headerName: "Credit",
          cellClass: ListAdvancedDefaultSettings.EXCEL_STYLE_IDS.Currency,
          valueFormatter: (evt) => {
            return formatCurrency(evt.value);}},
          { field: "balance", headerName: "balance",
          cellClass: ListAdvancedDefaultSettings.EXCEL_STYLE_IDS.Currency,
          valueFormatter: (evt) => {
            return formatCurrency(evt.value);}
          },
          { field: "reconcileStatus", headerName: "Reconcile Status",cellRenderer:reconcile},
          { field: "sourceType", headerName: "Source"},
         
        ]}
        fetchUrl={config.resourceUrls.transaction}
        actionMenuData={actions}
      />
  </PageContent>
  );
};

export default Transactions;

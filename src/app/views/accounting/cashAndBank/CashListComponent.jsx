import React, { useState, useEffect,useCallback } from "react";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";
import { Button } from "../../../shared/components/button/Button";
import { formatCurrency } from "../../../helpers/formatCurrency";
const data=[
  {
    "openingBalance": 55,
    "id": 39,
    "bankName": "Cash",
    "accountNumber": "cash",
    "accountType": "savings",
    "branch": "cash",
    "IFSCCode": "cash",
    "customerId": "",
    "type": "cash",
    "notes": "bgfbfgbgt",
    "cashType": "cash",
    "chartOfAccountId": 144,
    "bankTransactions": [],
    "chartOfAccount": {
      "id": 144,
      "accountTypeId": "assets",
      "accountSubTypeId": "cashAndBank",
      "accountName": "Cash",
      "accountCode": 45263,
      "description": "Created from Cash And Bank",
      "status": "active"
    }
  },
  {
    "openingBalance": 510,
    "id": 37,
    "bankName": "Indian",
    "accountNumber": "7584353847561",
    "accountType": "current",
    "branch": "rambha",
    "IFSCCode": "11111111111",
    "customerId": "1111111",
    "type": "bank",
    "notes": "gergfrgfv",
    "cashType": "cash",
    "chartOfAccountId": 142,
    "bankTransactions": [
      {
        "credits": 0,
        "debits": 555,
        "balance": 610,
        "id": 80,
        "date": "2024-01-19T00:00:00.000Z",
        "notes": "vadfvafvfd",
        "reconcileStatus": false,
        "type": "in",
        "chartOfAccountId": 141,
        "bankDetailId": 37,
        "deletedAt": null,
        "invoiceId": null,
        "expenseId": null,
        "purchaseOrderId": null,
        "sourceType": null
      },
      {
        "credits": 100,
        "debits": 0,
        "balance": 510,
        "id": 81,
        "date": "2024-01-19T00:00:00.000Z",
        "notes": "ththtyeh",
        "reconcileStatus": false,
        "type": "out",
        "chartOfAccountId": 134,
        "bankDetailId": 37,
        "deletedAt": null,
        "invoiceId": null,
        "expenseId": null,
        "purchaseOrderId": null,
        "sourceType": null
      }
    ],
    "chartOfAccount": {
      "id": 142,
      "accountTypeId": "assets",
      "accountSubTypeId": "cashAndBank",
      "accountName": "Indian",
      "accountCode": 17680,
      "description": "Created from Cash And Bank",
      "status": "active"
    }
  },
  {
    "openingBalance": 655,
    "id": 40,
    "bankName": "Petty Cash",
    "accountNumber": "pettyCash",
    "accountType": "savings",
    "branch": "cash",
    "IFSCCode": "cash",
    "customerId": "",
    "type": "cash",
    "notes": "bgbheebtgh",
    "cashType": "pettyCash",
    "chartOfAccountId": 145,
    "bankTransactions": [],
    "chartOfAccount": {
      "id": 145,
      "accountTypeId": "assets",
      "accountSubTypeId": "cashAndBank",
      "accountName": "Petty Cash",
      "accountCode": 67835,
      "description": "Created from Cash And Bank",
      "status": "active"
    }
  },
  {
    "openingBalance": 66,
    "id": 38,
    "bankName": "SBI",
    "accountNumber": "44444444444444",
    "accountType": "savings",
    "branch": "bhopal",
    "IFSCCode": "55555555555",
    "customerId": "5555555557777",
    "type": "bank",
    "notes": "nhghnhnhrnrhnhtnhtnh",
    "cashType": "cash",
    "chartOfAccountId": 143,
    "bankTransactions": [],
    "chartOfAccount": {
      "id": 143,
      "accountTypeId": "assets",
      "accountSubTypeId": "cashAndBank",
      "accountName": "SBI",
      "accountCode": 93663,
      "description": "Created from Cash And Bank",
      "status": "active"
    }
  }
]

const CashListComponent = () => {
    const [banks, setBanks] = useState(data);

  //   useEffect(() => {
  //     // Fetch data from the API
  //     fetch("https://dev.groflex.in/api/bank", {
  //   method: 'GET',
  //   cache: 'no-store',
  // })
  //   .then((response) => response.json())
  //   .then((data) => setBanks(data))
  //   .catch((error) => console.error("Error fetching data:", error));
  //   }, []); // Empty dependency array ensures the effect runs only once when the component mounts
  
    return (
      <div className="s-card demo-table">
        <table className="table is-hoverable is-fullwidth">
          <tbody>
            <tr>
              <th colSpan={3} style={{ fontWeight: 600, fontSize: "21px", width:"455%",display:"flex",justifyContent:"space-between"}}> <span>Cash</span> <p><Button
                isOutlined
                isPrimary
                icon={ <FeatherIcon
									primaryColor
									name="Plus"
									
									size={18}
									style={{ height:"18px", width:"18px" }}
								/>}
              >
                Add cash type
              </Button></p> </th>
             
            </tr>
            <tr >
              <th style={{fontSize:"14px", fontWeight:550, width:"4%"}}>Balance</th>
              <th colSpan={2} style={{fontSize:"14px", fontWeight:550,  width:"90%"}}>Cash type</th>
             
                          
            </tr>
            {banks.map((bank, index) => {
              // Check if IFSC code contains a number
              if  (/[a-zA-Z]/.test(bank.IFSCCode)) {
                return (
                  <tr key={index}>
                    <td style={{color:"black"}} >{bank.openingBalance}</td>
                    <td style={{color:"black"}}>{bank.accountNumber}</td>
                  
                  
                    <td  style={{display:"flex", flexDirection:"row-reverse"}}><Button isPrimary isOutlined   style={{border:"none"}} >View Transactions</Button></td>
                  </tr>
                );
              }
              return null; // Skip rendering if IFSC code doesn't contain a number
            })}
          </tbody>
        </table>
      </div>
    );
  };
  


export default CashListComponent
import React from "react";
import { ListAdvancedComponent } from "../../shared/components/list-advanced/ListAdvancedComponent";
import { formatCurrency } from "../../helpers/formatCurrency";
import oldConfig from "../../../../oldConfig";
import { useNavigate } from "react-router-dom";
import moment from "moment";
const ContactDocumentsTab = ({ contactId }) => {
  const navigate = useNavigate();
  const handleActionClick = (action, row, params) => {
    switch (action.name) {
      case "Delete":
        break;
      case "Edit":
        break;
    }
  };
  const handleRowClicked = (e) => {
    let url = "";
    switch (e.data.type) {
      case "invoice":
        url = `/sales/invoices/${e.data.id}`;
        break;
      case "offer":
        url = `/sales/quotations/${e.data.id}`;
        break;
      case "recurringInvoice":
        url = `/sales/recurring-invoices/${e.data.id}`;
        break;
    }

    navigate(url);
  };
  return (
    <div className="contact-documents-tab-main">
      {" "}
      <ListAdvancedComponent
        onRowClicked={(e) => handleRowClicked(e)}
        onActionClick={handleActionClick}
        columnDefs={[
          {
            field: "number",
            headerName: "NO.",
          },
          {
            field: "type",
            headerName: "TYPE",
            cellRenderer: (evt) => {
              return evt.value.charAt(0).toUpperCase() + evt.value.slice(1);
            },
          },
          {
            field: "date",
            headerName: "DATE",
            cellRenderer: (evt) => {
              return moment(evt.value).format("DD/MM/YYYY");
            },
          },
          {
            field: "state",
            headerName: "STATUS",
            cellRenderer: (evt) => {
              return evt.value.charAt(0).toUpperCase() + evt.value.slice(1);
            },
          },
          {
            field: "totalGross",
            headerName: "PRICE",
            cellRenderer: (evt) => {
              return formatCurrency(evt.value);
            },
          },
        ]}
        fetchUrl={(offset, limit) =>
          `${oldConfig.customer.resourceUrl}/${contactId}/history?offset=${offset}&limit=${limit}&orderBy=date&desc=true&filter=all`
        }
      />
    </div>
  );
};

export default ContactDocumentsTab;

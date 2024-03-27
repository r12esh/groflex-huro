import React, { useEffect, useState } from "react";
import { ListAdvancedComponent } from "../../shared/components/list-advanced/ListAdvancedComponent";
import oldConfig from "../../../../oldConfig";
import moment from "moment";
import groflexService from "../../services/groflex.service";
import { useNavigate } from "react-router-dom";
const ContactActivitiesTab = ({ contactId }) => {
  const navigate = useNavigate();
  const actions = [
    { name: "Edit", icon: "edit" },
    { name: "Delete", icon: "trash-alt" },
  ];

  const handleActionClick = (action, row, params) => {
    switch (action.name) {
      case "Delete":
        break;
      case "Edit":
        break;
    }
  };

  const formatTitle = (evt) => {
    let title = "";

    let url1 = "";
    let url2 = "";

    if (evt.data.metaData.invoice && evt.data.metaData.offer) {
      title =
        "Action: " +
        evt.value.replace(
          "{{ offer }} converted to {{ invoice }}",
          `${evt.data.metaData.offer.number} converted to ${evt.data.metaData.invoice.number}`
        );
      url1 = `/sales/quotations/${evt.data.metaData.offer.id}`;
      url2 = `/sales/invoices/${evt.data.metaData.invoice.id}`;
    } else if (evt.data.metaData.invoice) {
      title =
        "Action: " +
        evt.value.replace("{{ invoice }}", evt.data.metaData.invoice.number);
      url1 = `/sales/invoices/${evt.data.metaData.invoice.id}`;
    } else if (evt.data.metaData.offer) {
      title =
        "Action: " +
        evt.value.replace("{{ offer }}", evt.data.metaData.offer.number);
      url1 = `/sales/invoices/${evt.data.metaData.offer.id}`;
    } else if (evt.data.metaData.expense) {
      title =
        "Action: " +
        evt.value.replace(
          "{{ expense }}",
          evt.data.metaData.expense.receiptNumber
        );
      url1 = `/accounting/expenses`;
    }
    const words = title.split(" ");

    return (
      <div>
        {words.map((item, id) => {
          if (id === 2) {
            return (
              <span
                style={{ color: "#00a353", fontWeight: "500" }}
                onClick={() => navigate(url1)}
              >
                {item + " "}
              </span>
            );
          } else if (id === 5) {
            return (
              <span
                style={{
                  color: url2 ? "#00a353" : "#272d30",
                  fontWeight: url2 ? "500" : "",
                }}
                onClick={() => navigate(url2)}
              >
                {item + " "}
              </span>
            );
          } else {
            return item + " ";
          }
        })}
      </div>
    );
  };
  return (
    <div className="contact-activities-tab-main">
      <ListAdvancedComponent
        onRowClicked={(e) => {}}
        onActionClick={handleActionClick}
        columnDefs={[
          {
            field: "title",
            headerName: "Type",
            cellRenderer: (evt) => {
              return formatTitle(evt);
            },
          },

          {
            field: "createdAt",
            headerName: "Date",
            cellRenderer: (evt) => {
              return moment(evt.value).format("DD/MM/YYYY");
            },
          },
        ]}
        fetchUrl={(offset, limit) =>
          `${oldConfig.resourceHost}history?customerId=${contactId}&offset=${offset}&limit=${limit}&filter=all`
        }
      />
    </div>
  );
};

export default ContactActivitiesTab;

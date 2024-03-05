import React, { useState, useEffect } from "react";
import PageContent from "../../shared/components/pageContent/PageContent";
import { ListAdvancedComponent } from "../../shared/components/list-advanced/ListAdvancedComponent";
import { formatCurrency } from "../../helpers/formatCurrency";
import {
  ListAdvancedDefaultSettings,
  customerTypes,
} from "../../helpers/constants";
import { isNil } from "../../helpers/isNil";
import config from "../../../../newConfig";
import EditContact from "./EditContact";
import { useParams, useNavigate } from "react-router-dom";
import groflexService from "../../services/groflex.service";
import FontAwesomeIcon from "../../shared/fontAwesomeIcon/FontAwesomeIcon";
import { Button } from "../../shared/components/button/Button";

// const getCompanyPersonIcon = (
//   value,
//   personIconWidth,
//   blankContactPersonIcon,
//   isMainContact
// ) => {
//   const masterDetailArrowClass =
//     !isNil(isMainContact) && isMainContact.toString() === "false" ? "grey" : "";

//   return value === customerTypes.PERSON ? (
//     `<span class="icon-user-wrapper"><img src="/assets/images/svg/user.svg" width="${personIconWidth}" /></span>`
//   ) : value === ListAdvancedDefaultSettings.CUSTOMER_TYPE_CONTACTPERSON ? (
//     blankContactPersonIcon ? (
//       ""
//     ) : (
//       `<span class="icon icon-arrow_right2 master-detail-arrow ${masterDetailArrowClass}"></span>`
//     )
//   ) : (
//     <i style={{ color: "#00A353" }} className={"fas fa-building"}></i>
//   );
// };

const Contacts = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const navigate = useNavigate();
  const [previousData, setPreviousData] = useState(undefined);

  const actions = [
    { name: "Edit", icon: "edit" },
    { name: "Delete", icon: "trash-alt" },
  ];

  const getIconType = (value) => {
    let icon = "";

    switch (value) {
      case "company":
        icon = <FontAwesomeIcon name={"building"} size={18} color="#00A353" />;
        break;
      case "person":
        icon = (
          <FontAwesomeIcon name={"circle-user"} size={18} color="#0071ca" />
        );
        break;
    }

    return icon;
  };

  const handleActionClick = (action, rowData) => {
    if (rowData) {
      if (action.name === "Edit") {
        if (rowData.id) {
          setSelectedContact(rowData.id);
          const previousData = { ...rowData };
          setPreviousData(previousData);
          navigate(`/contacts-edit/${rowData.id}`, { state: { previousData } });
        } else {
          // console.log("Invalid rowData:", rowData);
        }
      } else if (action.name === "Delete") {
        // Implement delete functionality
      }
    } else {
      console.log("Invalid rowData:", rowData);
    }
  };
  useEffect(() => {
    if (previousData) {
      console.log("previousData:", previousData);
    }
  }, [previousData]);

  return (
    <PageContent
      title="Contacts"
      titleActionContent={
        <Button onClick={() => navigate("/contacts-create")} isSuccess>
          Create new contact
        </Button>
      }
    >
      <ListAdvancedComponent
        onActionClick={handleActionClick}
        columnDefs={[
          { field: "number", headerName: "No.", filter: false },
          {
            field: "kind",
            headerName: "Type",
            cellRenderer: (evt) => {
              // return getCompanyPersonIcon(evt.value, 20, true);
              return getIconType(evt.value);
            },
            cellStyle: {
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            },
            filter: false,
            // flex: 1.5,
          },
          {
            field: "type",
            headerName: "Contact Type",
            cellRenderer: (evt) => {
              return evt.data.type === `customer` ? `Customer` : `Payee`;
            },
          },
          { field: "name", headerName: "Name" },
          {
            field: "outstandingAmount",
            headerName: "Outstanding Amount",
            valueFormatter: (evt) => {
              return formatCurrency(evt.value);
            },
            cellStyle: {
              textAlign: "right",
            },
          },
          { field: "address.street", headerName: "Address" },
          { field: "email", headerName: "E-mail" },
          { field: "phone1", headerName: "Telephone" },
          { field: "mobile", headerName: "Mobile" },
          { field: "category", headerName: "Category" },
          { field: "address.gstNumber", headerName: "GST Number" },
        ]}
        fetchUrl={config.resourceUrls.customers}
        actionMenuData={actions}
      />
    </PageContent>
  );
};

export default Contacts;

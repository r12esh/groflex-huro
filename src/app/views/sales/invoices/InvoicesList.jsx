import React, { useEffect, useState } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { useNavigate } from "react-router-dom";
import config from "../../../../../newConfig";
import {
  ListAdvancedDefaultSettings,
  transactionTypes,
} from "../../../helpers/constants";
import { CustomShowHeaderSum } from "../../../shared/components/list-advanced/CustomShowHeaderSum";
import { ListAdvancedComponent } from "../../../shared/components/list-advanced/ListAdvancedComponent";
import { formatCurrency } from "../../../helpers/formatCurrency";
import { Button } from "../../../shared/components/button/Button";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";
import {
  dateCompareSort,
  localeCompare,
  localeCompareNumeric,
} from "../../../helpers/sortComparators";
import groflexService from "../../../services/groflex.service";
import FontAwesomeIcon from "../../../shared/fontAwesomeIcon/FontAwesomeIcon";
import { formatDateforUi } from "../../../helpers/dateFormatters";
import InvoiceState from "../../../enums/invoice/invoice-state.enum";
import userPermissions from "../../../enums/user-permissions.enum";
import Invoice from "../../../models/invoice.model";
import resources from "../../../shared/resources/resources";
import CancelDeleteInvoiceModal from "./CancelDeleteInvoiceModal";
import DeleteInvoiceModal from "./DeleteInvoiceModal";
import CancelInvoiceModal from "./CancelInvoiceModal";
import NumberRangeModal from "../../../shared/components/numberRange/NumberRangeModal";
import LoaderSpinner from "../../../shared/components/loaderSpinner/LoaderSpinner";
import TextModuleModal from "../../../shared/components/textModuleModal/TextModuleModal";
import DunningModal from "../../../shared/components/dunngingModal/DunningModal";

const PAYABLE_STATES = [
  InvoiceState.DUNNED,
  InvoiceState.LOCKED,
  InvoiceState.PARTIALLY_PAID,
];
const CANCEL_OR_DELETE_STATES = [
  "open",
  InvoiceState.DUNNED,
  InvoiceState.LOCKED,
];
const CANCEL_STATES = [InvoiceState.PAID, InvoiceState.PARTIALLY_PAID];
const NOT_ALLOWED_TO_COPY = [
  transactionTypes.TRANSACTION_TYPE_DEPOSIT_INVOICE,
  transactionTypes.TRANSACTION_TYPE_CLOSING_INVOICE,
];

const actions = [
  { name: "Edit", action: "edit", icon: "edit" },
  { name: "Delete", action: "delete", icon: "trash-alt" },
];

const type = (params) => {
  let res = "";
  switch (params.value) {
    case "recurringInvoice":
      res = "Recurring invoice";
      break;
    case "invoice":
      res = "Invoice";
      break;
    default:
      res = "default";
  }
  return <>{res}</>;
};

const createActivity = (params) => {
  let val = "";
  let iconColor = "";

  switch (params.value.toLowerCase()) {
    case InvoiceState.DRAFT:
      val = "Draft";
      iconColor = "#DDDDDD";
      break;
    case InvoiceState.LOCKED:
    case InvoiceState.SENT:
      val = "Open";
      iconColor = "#0071CA";
      break;
    case InvoiceState.PARTIALLY_PAID:
      val = "Partially paid";
      iconColor = "#FFAA2C";
      break;
    case InvoiceState.CANCELLED:
      val = "Cancelled";
      iconColor = "#888787";
      break;
    case InvoiceState.DUNNED:
      iconColor = "#D94339";
      val = "Reminded";
      break;
    case InvoiceState.PAID:
    case InvoiceState.PRINTED:
      val = "Paid";
      iconColor = "#00A353";
      break;
  }

  return (
    <div className="quotations-status">
      <FontAwesomeIcon name={"circle"} size={11} color={iconColor} />
      {val}
    </div>
  );
};

// Note: Component starts here
const InvoicesList = () => {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [invoiceListStates, setInvoiceListStates] = useState({
    isLoading: true,
    invoiceData: null,
    selectedRows: [],
    // TODO: Manage permissions here from User from groflexService
    canCreateInvoice: true,
    canDeleteInvoice: true,
    canUpdateInvoice: true,
    canRegisterPayment: true,
    canCreateReminder: true,
    // canCreateInvoice:
    //   groflexService.user &&
    //   groflexService.user.hasPermission(userPermissions.CREATE_INVOICE),
    // canDeleteInvoice:
    //   groflexService.user &&
    //   groflexService.user.hasPermission(userPermissions.DELETE_INVOICE),
    // canUpdateInvoice:
    //   groflexService.user &&
    //   groflexService.user.hasPermission(userPermissions.UPDATE_INVOICE),
    // canRegisterPayment:
    //   groflexService.user &&
    //   groflexService.user.hasPermission(userPermissions.ENTER_INVOICE_PAYMENT),
    // canCreateReminder:
    //   groflexService.user &&
    //   groflexService.user.hasPermission(
    //     userPermissions.CREATE_INVOICE_REMINDER
    //   ),
  });
  const [cancelDeleteInvoiceModalActive, setCancelDeleteInvoiceModalActive] =
    useState(false);
  const [deleteInvoiceModalActive, setDeleteInvoiceModalActive] =
    useState(false);
  const [cancelInvoiceModalActive, setCancelInvoiceModalActive] =
    useState(false);
  const [cancelDeleteModalData, setCancelDeleteModalData] = useState();

  const refreshPage = () => {
    setRefresh(!refresh);
  };

  const handleActionCellPopupClick = (action, row, params) => {
    switch (action.action) {
      case "delete":
        const invoice = new Invoice(row);
        setCancelDeleteModalData({ row: invoice, params });
        if (invoice.invoiceType === "cancellation") {
          groflexService.toast.success(
            resources.cancellationDeleteErrorMessage
          );
        } else if (!invoice.isLocked) {
          setDeleteInvoiceModalActive(true);
        } else if (CANCEL_STATES.indexOf(invoice.state) > -1) {
          setCancelInvoiceModalActive(true);
        } else {
          setCancelDeleteInvoiceModalActive(true);
        }
        break;
      case "edit":
        navigate(`/sales/invoices/edit/${row.id}`);
        break;
      case "copyAndEdit":
        break;
      case "addPayment":
        // addPayment(row);
        break;
      default:
        break;
    }
  };

  const getActionPopupButtons = (item) => {
    const entries = [];
    let invoice = null;

    if (item) {
      invoice = new Invoice(item);

      if (invoiceListStates.canRegisterPayment) {
        if (PAYABLE_STATES.includes(invoice.state)) {
          entries.push({
            label: "Add payment",
            action: "addPayment",
            dataQsId: "invoice-list-item-dropdown-addpayment",
          });
        }
      }

      if (invoiceListStates.canUpdateInvoice) {
        if (invoice.state === InvoiceState.DRAFT) {
          entries.push({
            label: "Edit",
            action: "edit",
            dataQsId: "invoice-list-item-dropdown-entry-edit",
          });
        }

        if (!NOT_ALLOWED_TO_COPY.includes(invoice.type)) {
          entries.push({
            label: "Copy and edit",
            action: "copyAndEdit",
            dataQsId: "invoice-list-item-dropdown-copyandedit",
          });
        }
      }

      if (invoiceListStates.canDeleteInvoice) {
        if (invoice.state === InvoiceState.DRAFT) {
          entries.push({
            label: "Delete",
            action: "delete",
            dataQsId: "invoice-list-item-dropdown-delete",
          });
        }

        if (!invoice.metaData.closingInvoiceExists) {
          if (CANCEL_OR_DELETE_STATES.includes(invoice.state)) {
            entries.push({
              label: "Cancel / Delete",
              action: "delete",
              dataQsId: "invoice-list-item-dropdown-delete",
            });
          } else if (CANCEL_STATES.includes(invoice.state)) {
            entries.push({
              label: "Cancel",
              action: "delete",
              dataQsId: "invoice-list-item-dropdown-delete",
            });
          }
        }
      }
      if (invoiceListStates.canCreateReminder) {
        if (invoice.isOverDue) {
          entries.push({
            label: "Create payment reminder",
            action: "dun",
            dataQsId: "invoice-list-item-dropdown-dun",
          });
        }
      }

      if (entries.length === 0) {
        entries.push({
          label: "No action available",
          customEntryClass: "popover-entry-disabled",
        });
      }
    }
    return entries;
  };

  console.log(groflexService.user, "USER FROm INCOICE LIST");

  const [isLoading, setIsLoading] = useState(false);
  // for number range modal
  const [isModalActive, setIsModalActive] = useState(false);

  // for Text Module
  const [isTextModuleModalActive, setIsTextModuleActive] = useState(false);

  // for Dunning
  const [isDunningModalActive, setIsDunningModalActive] = useState(false);

  // settings elements
  const elements = [
    {
      title: "Text Modules",
      handleClick: () => {
        setIsTextModuleActive(true)
      },
    },
    {
      title: "Number Range",
      handleClick: () => {
        setIsModalActive(true);
      },
    },
    {
      title: "Dunning",
      handleClick: () => {
        setIsDunningModalActive(true);
      },
    },
  ]

  return (
    <PageContent
      title="Invoices"
      titleActionContent={<Button isSuccess>Create Invoices</Button>}
      breadCrumbData={["Home", "Sales", "Invoices"]}
    >
      {
        isModalActive && (
          <NumberRangeModal
            isActive={isModalActive}
            setIsActive={setIsModalActive}
            numerationType='invoice'
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )
      }
      {
        isTextModuleModalActive && (
          <TextModuleModal
            isActive={isTextModuleModalActive}
            setIsActive={setIsTextModuleActive}
            textModuleType='invoice'
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )
      }
      {
        isDunningModalActive && (
          <DunningModal
            isActive={isDunningModalActive}
            setIsActive={setIsDunningModalActive}
            isLoading={isLoading}
            setIsLoading= {setIsLoading}
          />
        )
      }


      <ListAdvancedComponent
        onRowClicked={(e) => {
          navigate(`/sales/invoices/${e.data.id}`);
        }}
        onActionClick={handleActionCellPopupClick}
        columnDefs={[
          {
            field: "number",
            headerName: "Number",
          },
          {
            field: "state",
            headerName: "status",
            cellRenderer: createActivity,
            comparator: (a, b) => {
              const order = [
                // Bezahlt
                InvoiceState.PAID,
                InvoiceState.PRINTED,

                // Entwurf
                InvoiceState.DRAFT,

                // Offen
                InvoiceState.LOCKED,
                InvoiceState.SENT,
                InvoiceState.PARTIALLY_PAID,

                // Storniert
                InvoiceState.CANCELLED,

                // Überfällig
                InvoiceState.DUNNED,
              ];

              return order.indexOf(a) - order.indexOf(b);
            },
            minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
          },
          {
            field: "customerData.name",
            headerName: "Customer Name",
            minWidth: 170,
          },
          {
            headerName: "Currency",
            field: "baseCurrency",
            minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
            comparator: localeCompare,
            hide: true,
            filterParams: {
              suppressMiniFilter: true,
            },
            valueFormatter: (evt) => {
              console.log(
                evt.value === "" || evt.value === null ? "INR" : evt.value
              );
              return evt.value === "" || evt.value === null ? "INR" : evt.value;
            },
          },
          {
            minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
            headerName: "Date created",
            field: "date",
            filter: true,
            comparator: (date1, date2) =>
              dateCompareSort(date1, date2, config.dateFormat.client),
            cellRenderer: (params) => {
              return formatDateforUi(new String(params.value));
            },
          },

          {
            minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
            field: "dueToDate",
            filter: true,
            comparator: (date1, date2) =>
              dateCompareSort(date1, date2, config.dateFormat.client),
            headerName: "Due Date",
            cellRenderer: (params) => {
              return params.value
                ? formatDateforUi(new String(params.value))
                : "-";
            },
          },

          // {
          //   field: "dueSince",
          //   comparator: localeCompareNumeric,
          //   filter: "agNumberColumnFilter",
          //   filterParams: {
          //     suppressAndOrCondition: true,
          //   },
          //   valueFormatter: (evt) => {
          //     console.log(evt, "MY VALUE");
          //     return evt.value ? evt.value + " days" : "";
          //   },
          //   headerName: "Due Since",
          //   minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
          // },

          {
            field: "totalGross",
            headerName: "Total Gross",
            cellClass: "text-right",
            valueFormatter: (evt) => {
              return formatCurrency(evt.value);
            },
            headerComponent: CustomShowHeaderSum,
            headerComponentParams: { value: "totalGross", headerName: "Total" },
            minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
          },
          {
            field: "outstandingAmount",
            headerName: "Outstanding",
            cellClass: "text-right",
            valueFormatter: (evt) => {
              return formatCurrency(evt.value);
            },
            headerComponent: CustomShowHeaderSum,
            headerComponentParams: {
              value: "outstandingAmount",
              headerName: "Outstanding",
            },
            minWidth: ListAdvancedDefaultSettings.COLUMN_MIN_WIDTH,
          },
          {
            field: "type",
            headerName: "type",
            cellRenderer: type,
            minWidth: 150,
          },
        ]}
        fetchUrl={config.resourceUrls.invoices}
        actionMenuData={getActionPopupButtons}
        settingsElement={elements}
      />
      {cancelDeleteInvoiceModalActive && (
        <CancelDeleteInvoiceModal
          closeFunction={() => setCancelDeleteInvoiceModalActive(false)}
          isActive={cancelDeleteInvoiceModalActive}
          data={cancelDeleteModalData}
          onSubmit={refreshPage}
        />
      )}
      {deleteInvoiceModalActive && (
        <DeleteInvoiceModal
          closeFunction={() => setDeleteInvoiceModalActive(false)}
          isActive={deleteInvoiceModalActive}
          data={cancelDeleteModalData}
          onSubmit={refreshPage}
        />
      )}
      {cancelInvoiceModalActive && (
        <CancelInvoiceModal
          closeFunction={() => setCancelInvoiceModalActive(false)}
          isActive={cancelInvoiceModalActive}
          data={cancelDeleteModalData}
          onSubmit={refreshPage}
        />
      )}
    </PageContent>
  );
};

export default InvoicesList;

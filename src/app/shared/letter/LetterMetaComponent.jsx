import React, { useEffect, useState } from "react";
import config from "../../../../oldConfig";
import { isEmpty } from "lodash";
import { convertDateKeyToPreview } from "../../helpers/convertDateKeyToPreview";
import InvoiceState from "../../enums/invoice/invoice-state.enum";
import Modal from "../components/modal/Modal";
import Direction from "../../enums/direction.enum";
import Invoice from "../../models/invoice.model";
import {
  formateClientDateMonthYear,
  formatApiDate,
} from "../../helpers/formatDate";
import OfferState from "../../enums/offer/offer-state.enum";
import Offer from "../../models/offer.model";
import PurchaseOrder from "../../models/purchase-order.model";
import { getInvoiceNumber } from "../../helpers/transaction/getInvoiceNumber";
import groflexService from "../../services/groflex.service";
import { Input } from "../components/input/Input";
import LetterMetaEditComponent from "./LetterMetaEditComponent";
import LetterMetaDisplayComponent from "./LetterMetaDisplayComponent";
import NumberRangeModal from "../components/numberRange/NumberRangeModal";
import DateInput from "../components/datePicker/DateInput";
import resources from "../resources/resources";
import { FeatherIcon } from "../featherIcon/FeatherIcon";
import EditableIndicatorDiv from "../editableIndicatorDiv/EditableIndicatorDiv";
import moment from "moment";
import PopOver from "../components/popOver/PopOver";
import OnClickOutside from "../components/onClickOutside/OnClickOutside";

const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;
const MAX_CUSTOM_FIELDS = 3;

const DELIVERY_DATE_NAME = "deliveryDate";
const DATE_NAME = "date";
const DELIVERY_PERIOD_NAME = "deliveryPeriod";
const DELIVERY_PERIOD_START_NAME = "deliveryPeriodStartDate";
const DELIVERY_PERIOD_END_NAME = "deliveryPeriodEndDate";

const LetterMetaComponent = ({
  numerationOptions,
  isRecurring,
  recurringInvoice,
  data,
  isQuotation,
  isPurchaseOrder,
  isInvoice,
  isProformaInvoice,
  onChange,
}) => {
  const [editMetaActive, setEditMetaActive] = useState(false);
  const [numberRangeIsLoading, setNumberRangeIsLoading] = useState(false);
  const [numberRangeModalActive, setNumberRangeModalActive] = useState(false);
  const [state, setState] = useState({
    data,
    originalData: data,
    numerationOptions,
    isQuotation,
    isPurchaseOrder,
    isProformaInvoice,
    isRecurring,
    recurringInvoice,
    isInvoice,
  });

  useEffect(() => {}, [editMetaActive]);

  const closeEdit = () => {
    setEditMetaActive(false);
  };

  const openEdit = () => {
    setEditMetaActive(true);
  };

  // Field Value change functions start here:
  const handleCustomerNumberChange = (e) => {
    const number = e.target.value;
    const { data, isPurchaseOrder, isQuotation, isProformaInvoice } = state;
    data.customerData = { ...data.customerData, number: parseInt(number, 10) };
    const newData = isQuotation
      ? new Offer(data)
      : isPurchaseOrder
      ? new PurchaseOrder(data)
      : new Invoice(data);
    setState({ ...state, data: newData });
  };

  const handleDateChange = (name, value) => {
    const { data, isPurchaseOrder, isQuotation, isProformaInvoice } = state;
    // value = moment(value, 'DD.MM.YYYY').format(config.dateFormat.api);
    value = formatApiDate(value);
    const newData = Object.assign({}, data, { [name]: value });

    console.log(name, value, "New obj in handle date format");

    if (name === DATE_NAME) {
      const { infoSectionFields } = newData;
      const deliveryDateField = infoSectionFields.find(
        (field) => field.name === DELIVERY_DATE_NAME
      );

      if (deliveryDateField) {
        if (
          !deliveryDateField.active &&
          newData.deliveryDate !== newData.date
        ) {
          newData.deliveryDate = newData.date;
        }
      }
    }

    const newObj = isQuotation
      ? new Offer(newData)
      : isPurchaseOrder
      ? new PurchaseOrder(newData)
      : new Invoice(newData);

    setState({ ...state, data: newObj });
    onChange(newObj);
  };

  const handleDateRangeChange = (name, date) => {
    const { data, isPurchaseOrder, isQuotation, isProformaInvoice } = state;
    date = formateClientDateMonthYear(date, config.dateFormat.client);
    const newData = Object.assign({}, data, { [name]: date });
    console.log(date, "date range handler");
    if (name === DELIVERY_PERIOD_START_NAME) {
      const deliveryEnd = data.deliveryPeriod.split(" - ")[1];
      newData[DELIVERY_PERIOD_NAME] = `${date} - ${deliveryEnd}`;
    }

    if (name === DELIVERY_PERIOD_END_NAME) {
      const deliveryStart = data.deliveryPeriod.split(" - ")[0];
      newData[DELIVERY_PERIOD_NAME] = `${deliveryStart} - ${date}`;
    }

    const newObj = isQuotation
      ? new Offer(newData)
      : isPurchaseOrder
      ? new PurchaseOrder(newData)
      : new Invoice(newData);

    setState({ ...state, data: newObj });
    onChange(newObj);
  };

  const handleFieldHideClick = (field, index) => {
    const { data, isPurchaseOrder, isQuotation, isProformaInvoice } = state;
    let originalField = data.infoSectionFields.find(
      (infoField) => infoField.name === field.name
    );

    if (!originalField && index >= 0) {
      originalField = data.infoSectionCustomFields[index];
    }

    if (originalField) {
      originalField.active = false;
    }

    const newData = isQuotation
      ? new Offer(data)
      : isPurchaseOrder
      ? new PurchaseOrder(data)
      : new Invoice(data);
    setState({ ...state, data: newData });
  };

  // Field Label change
  const handleFieldLabelChange = (e, name) => {
    const value = e.target.value;
    const { data, isQuotation, isPurchaseOrder, isProformaInvoice } = state;
    const field = data.infoSectionFields.find((field) => field.name === name);
    field.label = value;
    const newData = isQuotation
      ? new Offer(data)
      : isPurchaseOrder
      ? new PurchaseOrder(data)
      : new Invoice(data);
    setState({ ...state, data: newData });
  };

  // Custom Field Label and Value change
  const handleCustomFieldLabelChange = (e, index) => {
    const value = e.target.value;
    const { data, isQuotation, isPurchaseOrder, isProformaInvoice } = state;
    const field = data.infoSectionCustomFields[index];
    field.label = value;
    const newData = isQuotation
      ? new Offer(data)
      : isPurchaseOrder
      ? new PurchaseOrder(data)
      : new Invoice(data);
    setState({ ...state, data: newData });
  };

  const handleCustomFieldValueChange = (e, index) => {
    const value = e.target.value;
    const { data, isQuotation, isPurchaseOrder, isProformaInvoice } = state;
    const field = data.infoSectionCustomFields[index];
    field.value = value;
    const newData = isQuotation
      ? new Offer(data)
      : isPurchaseOrder
      ? new PurchaseOrder(data)
      : new Invoice(data);
    setState({ ...state, data: newData });
  };

  // Create Form
  const createForm = () => {
    const { data, numerationOptions, isRecurring, recurringInvoice } = state;
    const { infoSectionFields, infoSectionCustomFields } = data;
    const fields = infoSectionFields.map((field) => {
      const { name, active, label, required } = field;

      if (!active) {
        return;
      }

      let valueField;
      switch (name) {
        case "invoiceNumber": {
          let nextNewNumber = numerationOptions.currentValue + 1;
          let numberString = nextNewNumber.toString();
          numberString = numberString.padStart(
            numerationOptions.counterLength,
            "0"
          );
          const datePart = convertDateKeyToPreview(numerationOptions.datePart);
          const nextNumber =
            numerationOptions.prefix +
            numerationOptions.placeHolder1 +
            datePart +
            numerationOptions.placeHolder2 +
            numberString +
            numerationOptions.placeHolder3 +
            numerationOptions.suffix;
          const number =
            data.state === InvoiceState.DRAFT ||
            data.state === InvoiceState.RECURRING_TEMPLATE
              ? nextNumber
              : data.number;

          valueField = (
            <div className="letter-meta-form-field">
              <Input
                fieldClassName={"cursor-pointer field-input"}
                value={number}
                onChange={(e) => {}}
                placeholder={label}
                onClick={(e) => {
                  e.stopPropagation();
                  setNumberRangeModalActive(true);
                }}
                onFocus={(e) => {
                  e.stopPropagation();
                  setNumberRangeModalActive(true);
                }}
              />
            </div>
          );
          break;
        }
        case "purchaseOrderNumber":
        case "offerNumber": {
          let nextNewNumber = numerationOptions.currentValue + 1;
          let numberString = nextNewNumber.toString();
          numberString = numberString.padStart(
            numerationOptions.counterLength,
            "0"
          );
          const datePart = convertDateKeyToPreview(numerationOptions.datePart);
          const nextNumber =
            numerationOptions.prefix +
            numerationOptions.placeHolder1 +
            datePart +
            numerationOptions.placeHolder2 +
            numberString +
            numerationOptions.placeHolder3 +
            numerationOptions.suffix;
          const number =
            data.state === OfferState.DRAFT ? nextNumber : data.number;
          valueField = (
            <div className="letter-meta-form-field">
              <Input
                fieldClassName={"cursor-pointer"}
                value={number}
                onChange={(e) => {}}
                placeholder={label}
                onClick={(e) => {
                  e.stopPropagation();
                  setNumberRangeModalActive(true);
                }}
              />
            </div>
          );
          break;
        }

        case "customerNumber": {
          const { customerData } = data;
          const rawCustomerNumber = customerData && customerData.number;
          const customerNumber = parseInt(rawCustomerNumber, 10) || null;
          valueField = (
            <div className="letter-meta-form-field">
              <Input
                type="number"
                value={customerNumber}
                onChange={handleCustomerNumberChange}
                placeholder={"Customer No."}
              />
            </div>
          );

          break;
        }

        case "date":
        case "offerDate":
        case "purchaseOrderDate":
        case "invoiceDate": {
          if (isRecurring) {
            valueField = (
              <div className="letter-meta-form-field">
                {recurringInvoice.displayStartDate}
              </div>
            );
          } else {
            valueField = (
              <div className="letter-meta-form-field">
                <DateInput
                  selectedDate={moment(data.displayDate, "DD-MM-YYYY")}
                  onDateChange={(value) => handleDateChange("date", value)}
                  format="DD-MM-YYYY"
                  style={{ width: "100%" }}
                />
              </div>
            );
          }
          break;
        }

        case "deliveryDate": {
          if (isRecurring) {
            valueField = (
              <div className="letter-meta-form-field">
                {recurringInvoice.displayStartDate}
              </div>
            );
          } else {
            valueField = (
              <div className="letter-meta-form-field">
                <DateInput
                  selectedDate={moment(data.displayDeliveryDate, "DD-MM-YYYY")}
                  onDateChange={(value) => handleDateChange(name, value)}
                  format="DD-MM-YYYY"
                  style={{ width: "100%" }}
                />
              </div>
            );
          }
          break;
        }

        case "deliveryPeriod": {
          if (isRecurring) {
            valueField = (
              <div className="letter-meta-form-field">
                {recurringInvoice.displayDeliveryPeriodStartDate}
                {" - "}
                {recurringInvoice.displayDeliveryPeriodEndDate}
              </div>
            );
          } else {
            valueField = (
              <div className="letter-meta-form-field letter-meta-form-delivery-period">
                <DateInput
                  // name={DELIVERY_PERIOD_START_NAME}
                  format={"DD-MM-YYYY"}
                  className={"delivery-period-start"}
                  maxDate={moment(
                    data.displayDeliveryPeriodEndDate,
                    "DD-MM-YYYY"
                  )}
                  selectedDate={moment(
                    data.displayDeliveryPeriodStartDate,
                    "DD-MM-YYYY"
                  )}
                  onDateChange={(date) =>
                    handleDateRangeChange(DELIVERY_PERIOD_START_NAME, date)
                  }
                />
                <span className="letter-meta-delivery-period-divider horizontal-margin-auto">
                  -
                </span>
                <DateInput
                  // name={DELIVERY_PERIOD_END_NAME}
                  format={"DD-MM-YYYY"}
                  className={"delivery-period-end"}
                  minDate={moment(
                    data.displayDeliveryPeriodStartDate,
                    "DD-MM-YYYY"
                  )}
                  selectedDate={moment(
                    data.displayDeliveryPeriodEndDate,
                    "DD-MM-YYYY"
                  )}
                  onDateChange={(date) =>
                    handleDateRangeChange(DELIVERY_PERIOD_END_NAME, date)
                  }
                />
              </div>
            );
          }
        }
      }

      return (
        <div
          className="letter-meta-form-row"
          key={`letter-meta-form-row-${name}`}
        >
          <div className="letter-meta-form-label">
            <Input
              value={label}
              onChange={(e) => handleFieldLabelChange(e, name)}
              placeholder={resources.letterMetaInfoLabel[name]}
            />
          </div>

          {valueField}

          {required ? null : (
            <div className="letter-meta-form-hide-button m-t-10">
              <FeatherIcon
                onHoverColor={"#D94339"}
                title={resources.str_hideTitle}
                name={"Trash2"}
                className={"cursor-pointer"}
                onClick={() => handleFieldHideClick(field)}
              />
            </div>
          )}
        </div>
      );
    });

    const customFields = infoSectionCustomFields.map((field, index) => {
      const { value, label, active } = field;

      if (!active) {
        return;
      }

      return (
        <div
          className="letter-meta-form-row"
          key={`letter-meta-form-row-custom-${index}`}
        >
          <div className="letter-meta-form-label">
            <Input
              value={label}
              onChange={(e) => handleCustomFieldLabelChange(e, index)}
              placeholder={resources.str_customLabel}
            />
          </div>

          <div className="letter-meta-form-field">
            <Input
              value={value}
              onChange={(e) => handleCustomFieldValueChange(e, index)}
              placeholder={resources.str_data}
            />
          </div>

          <div className="letter-meta-form-hide-button m-t-10">
            <FeatherIcon
              onHoverColor={"#D94339"}
              title={resources.str_hideTitle}
              name={"Trash2"}
              className={"cursor-pointer"}
              onClick={() => handleFieldHideClick(field, index)}
            />
          </div>
        </div>
      );
    });

    const contextMenu = createContextMenu();

    return (
      <OnClickOutside
        excludeClasses={["MuiPickersPopper-root", "transaction-form-meta"]}
        onClickOutside={handleOutsideClick}
        className="letter-meta-form"
      >
        {fields}
        {customFields}
        {contextMenu}
      </OnClickOutside>
    );
  };

  // Create display
  const createDisplay = () => {
    const { data, numerationOptions, isRecurring, recurringInvoice } = state;
    const { infoSectionFields, infoSectionCustomFields } = data;

    const fields = infoSectionFields.map((field) => {
      const { name, active, label } = field;

      if (!active) {
        return;
      }

      let valueField;

      switch (name) {
        case "invoiceNumber": {
          valueField = (
            <div className="letter-meta-display-value">
              {getInvoiceNumber(numerationOptions, data.state, data.number)}
            </div>
          );
          break;
        }

        case "purchaseOrderNumber":
        case "offerNumber": {
          let nextNewNumber = numerationOptions.currentValue + 1;
          let numberString = nextNewNumber.toString();
          //let numberString = numerationOptions.currentValue && numerationOptions.currentValue.toString();
          numberString = numberString.padStart(
            numerationOptions.counterLength,
            "0"
          );
          const datePart = convertDateKeyToPreview(numerationOptions.datePart);
          const nextNumber =
            numerationOptions.prefix +
            numerationOptions.placeHolder1 +
            datePart +
            numerationOptions.placeHolder2 +
            numberString +
            numerationOptions.placeHolder3 +
            numerationOptions.suffix;
          const number =
            data.state === OfferState.DRAFT ? nextNumber : data.number;
          valueField = (
            <div className="letter-meta-display-value">{number}</div>
          );
          break;
        }

        case "customerNumber":
          const { customerData } = data;
          const rawCustomerNumber = customerData && customerData.number;
          const customerNumber = parseInt(rawCustomerNumber, 10) || null;
          valueField = (
            <div className="letter-meta-display-value">
              {customerNumber || ""}
            </div>
          );
          break;

        case "date":
        case "offerDate":
        case "purchaseOrderDate":
        case "invoiceDate":
          valueField = (
            <div className="letter-meta-display-value">
              {isRecurring
                ? recurringInvoice.displayStartDate
                : data.displayDate}
            </div>
          );
          break;

        case "deliveryDate":
          valueField = (
            <div className="letter-meta-display-value">
              {isRecurring
                ? recurringInvoice.displayStartDate
                : data.displayDeliveryDate}
            </div>
          );
          break;

        case "deliveryPeriod":
          valueField = (
            <div className="letter-meta-display-value">
              {isRecurring
                ? `${recurringInvoice.displayDeliveryPeriodStartDate} - ${recurringInvoice.displayDeliveryPeriodEndDate}`
                : data.displayDeliveryPeriod}
            </div>
          );
          break;
      }

      return (
        <div
          className="letter-meta-display-row"
          key={`letter-meta-display-row-${name}`}
        >
          <div className="letter-meta-display-label">{label}</div>
          <div className="seperator-hyphen">-</div>
          {valueField}
        </div>
      );
    });

    const customFields = infoSectionCustomFields.map((field, index) => {
      const { value, label, active } = field;

      if (!active) {
        return;
      }

      return (
        <div
          className="letter-meta-display-row"
          key={`letter-meta-display-row-custom-${index}`}
        >
          <div className="letter-meta-display-label">{label}</div>
          <div className="seperator-hyphen">{label && value && "-"}</div>
          <div className="letter-meta-display-value">{value}</div>
        </div>
      );
    });

    return (
      <EditableIndicatorDiv
        onClick={openEdit}
        className="letter-meta-display p-10 cursor-pointer m-t-20"
      >
        {fields}
        {customFields}
      </EditableIndicatorDiv>
    );
  };

  // Create Context Menu
  const createContextMenu = () => {
    const { infoSectionFields, infoSectionCustomFields } = state.data;
    const missingFields = infoSectionFields.filter((field) => !field.active);
    const customFieldLength = infoSectionCustomFields.reduce(
      (a, b) => a + (b.active ? 1 : 0),
      0
    );
    const showMenu =
      missingFields.length > 0 || customFieldLength < MAX_CUSTOM_FIELDS;

    let menu = null;

    if (showMenu) {
      let entries = [];
      const mainFieldEntries = missingFields.map((missingField) => {
        if (!missingField.active) {
          const obj = {
            label: missingField.label,
            name: missingField.name,
            dataQsId: `letter-meta-add-field-${missingField.label}`,
            title: missingField.label,
          };
          return {
            ...obj,
            handleClick: () => handleContextMenuClick(obj),
          };
        }
      });

      const customFieldEntries =
        customFieldLength < MAX_CUSTOM_FIELDS
          ? [
              {
                label: resources.str_ownField,
                dataQsId: "letter-meta-add-custom",
                isCustomField: true,
                title: resources.str_ownField,
                handleClick: () =>
                  handleContextMenuClick({
                    label: resources.str_ownField,
                    dataQsId: "letter-meta-add-custom",
                    isCustomField: true,
                    title: resources.str_ownField,
                  }),
              },
            ]
          : [];

      // mainFieldEntries.length > 0 && entries.push(mainFieldEntries);
      // customFieldEntries.length > 0 && entries.push(customFieldEntries);
      entries = [...mainFieldEntries, ...customFieldEntries];

      menu = (
        <div className="letter-meta-form-context-menu m-t-20">
          <PopOver
            isRight
            elements={entries}
            label={
              <FeatherIcon
                name="PlusCircle"
                color="#878787"
                onHoverColor={"#00a353"}
                className={"cursor-pointer"}
              />
            }
          />
        </div>
      );
    }

    return menu;
  };

  const handleContextMenuClick = (entry) => {
    const { data, isQuotation, isPurchaseOrder, isInvoice } = state;

    if (entry.isCustomField) {
      let fieldActivated = false;
      data.infoSectionCustomFields.forEach((field) => {
        if (!fieldActivated && !field.active) {
          field.value = "";
          field.label = "";
          field.active = true;
          fieldActivated = true;
        }
      });
    } else {
      data.infoSectionFields.forEach((field) => {
        if (field.name === entry.name) {
          field.active = true;
        }
      });
    }

    const newObj = isQuotation
      ? new Offer(data)
      : isPurchaseOrder
      ? new PurchaseOrder(data)
      : new Invoice(data);

    setState({ ...state, data: newObj });
  };

  const handleOutsideClick = () => {
    const formIsValid = true;
    if (formIsValid) {
      closeEdit();
    }
  };

  console.log(data, "PROP data in letter meta component");
  console.log(state.data, "STATE data in letter meta component");
  const letterMetacontent = editMetaActive ? createForm() : createDisplay();

  return (
    <>
      {letterMetacontent}
      <NumberRangeModal
        setIsActive={setNumberRangeModalActive}
        numberType={isInvoice ? "invoice" : "offer"}
        isActive={numberRangeModalActive}
        isLoading={numberRangeIsLoading}
        setIsLoading={setNumberRangeIsLoading}
      />
    </>
  );
};

export default LetterMetaComponent;

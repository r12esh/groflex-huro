import React from "react";
import EditableIndicatorDiv from "../editableIndicatorDiv/EditableIndicatorDiv";
import { FeatherIcon } from "../featherIcon/FeatherIcon";
import FontAwesomeIcon from "../fontAwesomeIcon/FontAwesomeIcon";
import { customerTypes } from "../../helpers/constants";
import { formatMoneyCode } from "../../helpers/formatMoney";
import resources from "../resources/resources";
import { getLabelForCountry } from "../../helpers/getCountries";

const { COMPANY, PERSON } = customerTypes;

const RecipientDisplayComponent = ({
  customerData,
  baseCurrency,
  exchangeRate,
  onDisplayClick,
  onRemoveClick,
}) => {
  const handleRemoveClick = (event) => {
    event.stopPropagation();
    onRemoveClick();
  };

  const handleDisplayClick = (event) => {
    event.stopPropagation();
    onDisplayClick();
  };

  const {
    kind,
    salutation,
    title,
    firstName,
    lastName,
    companyName,
    companyNameAffix,
    // zipCode,
    // city,
    contact,
    countryIso,
    street,
    indiaState,
    gstNumber,
    cinNumber,
    mobile,
  } = customerData;

  let contactPersonDiv = "";
  const countryLabel = getLabelForCountry(countryIso);
  const countryDiv = countryIso ? <span>{countryLabel}</span> : null;
  if (contact && kind === COMPANY) {
    contactPersonDiv = contact ? (
      <div>
        {contact.salutation} {contact.title} {contact.firstName}{" "}
        {contact.lastName}
      </div>
    ) : null;
  }

  const NameComponent = () => {
    if (kind === COMPANY) {
      return (
        <div className="is-weight-600 billed-to-name">
          <div className="color-primary line-height-12">{companyName}</div>
          <div className="color-primary line-height-12">{companyNameAffix}</div>
        </div>
      );
    } else {
      return (
        <div className="is-weight-600 billed-to-name">
          <div className="color-primary line-height-12">
            {salutation} {title}
          </div>
          <div className="color-primary line-height-12">
            {firstName} {lastName}
          </div>
        </div>
      );
    }
  };

  return (
    <EditableIndicatorDiv
      style={{
        marginTop: "-10px",
      }}
      onClick={handleDisplayClick}
      // className="cursor-pointer p-10"
      className="recipient-display-component cursor-pointer p-t-10 p-b-10 p-l-10 p-r-20 m-r-10"
      icon={
        <FontAwesomeIcon
          onClick={handleRemoveClick}
          onHoverColor={"#D94339"}
          size={16}
          name={"circle-xmark"}
          className={"icon-class"}
          primaryColor
          style={{
            cursor: "pointer",
            marginTop: "-8px",
            marginRight: "-8px",
          }}
        />
      }
    >
      <NameComponent />
      {contactPersonDiv}
      <div className="billed-to-address m-t-10">
        <div className="address-label is-weight-600 color-secondary">
          Address
        </div>
        <div className="street-div">{street}</div>
        {/* <div>
					{zipCode} {city}
				</div> */}
        <div className="countryDisplay">
          {indiaState && indiaState.stateName ? (
            <span>{indiaState.stateName}, </span>
          ) : null}
          {countryDiv}
        </div>
      </div>

      {mobile ? (
        <div className="phone-no-container m-t-10">
          <div className="phone-label is-weight-600 color-secondary">
            Phone Number
          </div>
          <div>{mobile}</div>
        </div>
      ) : null}
      {kind === COMPANY && gstNumber ? (
        <div className="gstno-container m-t-10">
          <div className="gst-label is-weight-600 color-secondary">
            {resources.str_gst}
          </div>
          <div>{gstNumber}</div>
        </div>
      ) : null}
      {kind === COMPANY && cinNumber ? (
        <div className="cinno-container m-t-10">
          <div className="cin-label is-weight-600 color-secondary">
            {resources.str_cin}
          </div>
          <div>{cinNumber}</div>
        </div>
      ) : null}
      {/* {countryIso !== "IN" ? <span className="currencyDisplay">{`1 ${exchangeRate ? baseCurrency : customerData.baseCurrency} = ${formatMoneyCode(exchangeRate ? exchangeRate : customerData.exchangeRate)}`}</span> : null} */}
      {/* {countryIso !== "IN" ? <span className="currencyDisplay">{`1 ${baseCurrency} = ${!exchangeRate ? formatMoneyCode(customerData.exchangeRate) : formatMoneyCode(exchangeRate)}`}</span> : null} */}
      {countryIso !== "IN" ? (
        <div className="currencyDisplay font-italic m-t-10">{`1 ${baseCurrency} = ${formatMoneyCode(
          exchangeRate
        )}`}</div>
      ) : null}
    </EditableIndicatorDiv>
  );
};

export default RecipientDisplayComponent;

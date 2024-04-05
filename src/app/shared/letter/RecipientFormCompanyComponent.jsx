import React, { useEffect, useState } from "react";
import { SelectInput } from "../components/select/SelectInput";
import { Input } from "../components/input/Input";
import { getMiscellaneousData } from "../../helpers/getSettingsData";
import { TextArea } from "../components/textArea/TextArea";
import { getCountries } from "../../helpers/getCountries";
import OnClickOutside from "../components/onClickOutside/OnClickOutside";

const countriesOptions = getCountries().map((country) => ({
  label: country.label,
  value: country.iso2,
}));

const RecipientFormCompanyComponent = ({
  customerData,
  kindSelectorRadio,
  stateOptions,
  onBlur,
}) => {
  const {
    kind,
    street,
    countryIso,
    indiaState,
    gstNumber,
    cinNumber,
    mobile,
    companyName,
    contact,
    city,
    id,
    defaultExchangeRateToggle,
    exchangeRate,
    country,
    balance,
    openingBalance,
    title,
    salutation,
    firstName,
    lastName,
    name,
    baseCurrency,
    type,
    number,
    zipCode,
  } = customerData;

  const [recipientFormDataCompany, setRecipientFormDataCompany] = useState({
    companyName,
    contact,
    mobile,
    street,
    countryIso,
    indiaState,
    baseCurrency,
    exchangeRate,
    gstNumber,
    cinNumber,
    defaultExchangeRateToggle,
  });

  const [formErrors, setFormErros] = useState({
    companyNameError: "",
    contactError: "",
    mobileError: "",
    streetError: "",
    countryIsoError: "",
    indiaStateError: "",
    baseCurrencyError: "",
    exchangeRateError: "",
    gstNumberError: "",
    cinNumberError: "",
    salutationError: "",
    titleError: "",
    firstNameError: "",
    lastNameError: "",
    defaultExchangeRateToggleError: "",
  });

  const handleSalutationChange = (option) => {
    const selectedSalucation = option?.value.trim();
    const isNew = option?.__isNew__;
    if (!isNew) {
      setRecipientFormDataCompany({
        ...recipientFormDataCompany,
        salutation: selectedSalucation,
      });
    }
  };

  const handleTitleChange = (option) => {
    const selectedTitle = option?.value.trim();
    const isNew = option?.__isNew__;
    if (!isNew) {
      setRecipientFormDataCompany({
        ...recipientFormDataCompany,
        title: selectedTitle,
      });
    }
  };

  const handleCompanyNameChange = (event) => {
    let text = event.target.value.trim();
    setRecipientFormDataCompany({
      ...recipientFormDataCompany,
      companyName: text,
    });
  };

  const handleMobileChange = (event) => {
    const num = String(event.target.value).trim();
    if (num.length > 10) return;

    setRecipientFormDataCompany({
      ...recipientFormDataCompany,
      mobile: num,
    });
  };

  const handleStreetChange = (event) => {
    const text = event.target.value.trim();
    setRecipientFormDataCompany({
      ...recipientFormDataCompany,
      street: text,
    });
  };

  const handleCountryChange = (option) => {
    if (option.value !== "IN") {
      setRecipientFormDataCompany({
        ...recipientFormDataCompany,
        countryIso: option.value,
        indiaState: null,
      });
    } else {
      setRecipientFormDataCompany({
        ...recipientFormDataCompany,
        countryIso: option.value,
      });
    }
  };

  const handleStateChange = (option) => {
    setRecipientFormDataCompany({
      ...recipientFormDataCompany,
      indiaState: {
        id: option.vale,
        stateName: option.label,
      },
    });
  };

  const handleGstNoChange = (event) => {
    const gst = event.target.value.trim();
    if (gst.length > 15) return;
    setRecipientFormDataCompany({
      ...recipientFormDataCompany,
      gstNumber: gst,
    });
  };

  const handleCinNoChange = (event) => {
    const cin = event.target.value.trim();
    if (cin.length > 21) return;
    setRecipientFormDataCompany({
      ...recipientFormDataCompany,
      cinNumber: cin,
    });
  };

  const handleBlur = () => {
    const formIsValid = checkFormIsValid();
    if (true) {
      onBlur(recipientFormDataCompany);
    }
  };

  const checkFormIsValid = () => {};

  console.log(recipientFormDataCompany);

  return (
    <OnClickOutside onClickOutside={handleBlur}>
      {kindSelectorRadio}
      <div className="columns is-multiline m-t-5">
        <div className="field column is-12 p-b-0 p-t-0">
          <label>Customer Name</label>
          <Input
            placeholder={"Enter Company Name"}
            hasValidation
            value={recipientFormDataCompany.companyName}
            onChange={handleCompanyNameChange}
            helpText={formErrors.companyNameError}
            hasError={formErrors.companyNameError}
          />
        </div>
        {/* <div className="field column is-12 p-b-0 p-t-0">
          <label>Contact</label>
          <SelectInput
            options={countriesOptions}
            placeholder={"Select Contact"}
            value={recipientFormDataCompany.countryIso}
            onChange={handleCountryChange}
          />
        </div> */}
        <div className="field column is-12 p-b-0 p-t-0">
          <label>Mobile No.</label>
          <Input
            type="number"
            placeholder={"Enter Mobile No."}
            hasValidation
            value={recipientFormDataCompany.mobile}
            onChange={handleMobileChange}
            helpText={formErrors.mobileError}
            hasError={formErrors.mobileError}
          />
        </div>

        <div className="field column is-12 p-b-0 p-t-0">
          <label>Address</label>
          <TextArea
            rows={4}
            placeholder={"Enter Address"}
            value={recipientFormDataCompany.street}
            onChange={handleStreetChange}
          />
        </div>
        <div className="field column is-12 p-b-0 p-t-0">
          <label>Country</label>
          <SelectInput
            options={countriesOptions}
            placeholder={"Select Country"}
            value={recipientFormDataCompany.countryIso}
            onChange={handleCountryChange}
          />
        </div>
        {recipientFormDataCompany?.countryIso === "IN" && (
          <div className="field column is-12 p-b-0 p-t-0">
            <label>State</label>
            <SelectInput
              options={stateOptions}
              placeholder={"Select State"}
              value={recipientFormDataCompany?.indiaState?.id}
              onChange={handleStateChange}
              isLoading={!stateOptions}
            />
          </div>
        )}
        <div className="field column is-12 p-b-0 p-t-0">
          <label>GST NO.</label>
          <Input
            placeholder={"E.g.,07AAAAAOOOOA1Z6"}
            hasValidation
            value={recipientFormDataCompany.gstNumber}
            onChange={handleGstNoChange}
            helpText={formErrors.gstNumberError}
            hasError={formErrors.gstNumberError}
          />
        </div>
        <div className="field column is-12 p-b-0 p-t-0">
          <label>CIN</label>
          <Input
            placeholder={"E.g.,U 31909 WB 2020 PTC 247113"}
            hasValidation
            value={recipientFormDataCompany.cinNumber}
            onChange={handleCinNoChange}
            helpText={formErrors.cinNumberError}
            hasError={formErrors.cinNumberError}
          />
        </div>
      </div>
    </OnClickOutside>
  );
};

export default RecipientFormCompanyComponent;

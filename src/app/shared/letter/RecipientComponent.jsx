import React, { useEffect, useState } from "react";
import { Button } from "../components/button/Button";
import RecipientEmptyComponent from "./RecipientEmptyComponent";
import RecipientSelectComponent from "./RecipientSelectComponent";
import RecipientDisplayComponent from "./RecipientDisplayComponent";
import RecipientFormComponent from "./RecipientFormComponent";
import {
  customerTypes,
  recipientStates,
  contactTypes,
} from "../../helpers/constants";
import resources from "../resources/resources";
import groflexService from "../../services/groflex.service";
import config from "../../../../newConfig";

const { COMPANY, PERSON } = customerTypes;
const {
  RECIPIENT_STATE_EMPTY,
  RECIPIENT_STATE_FORM,
  RECIPIENT_STATE_SELECT,
  RECIPIENT_STATE_CUSTOMER_SELECTED,
} = recipientStates;

const SHOULD_CLOSE_FORM_STATES = [RECIPIENT_STATE_FORM, RECIPIENT_STATE_SELECT];

const RecipientComponent = ({
  onChange,
  transaction,
  customerData,
  recipientState,
  recipientType,
  customerFullData,
  isPurchaseOrder,
  baseCurrency,
  exchangeRate,
}) => {
  const [recipientComonentStates, setRecipientComonentStates] = useState({
    localCustomerData: customerData || undefined,
    localRecipientState:
      recipientState || (customerData && Object.keys(customerData).length > 0)
        ? RECIPIENT_STATE_CUSTOMER_SELECTED
        : RECIPIENT_STATE_EMPTY,
    oldCustomerData: undefined,
    errorMessage: "",
    gstErrorMessage: "",
    cinErrorMessage: "",
    mobileErrorMessage: "",
    balanceErrorMessage: "",
    currencyRates: [],
    baseCurrency,
    exchangeRate,
    // baseCurrency:  baseCurrency || "",
    // exchangeRate:  exchangeRate || 0.0,
    defaultExchangeRateToggle: false,
    toggleDisable: false,
  });

  const [showStates, setShowStates] = useState(
    recipientState || (customerData && Object.keys(customerData).length > 0)
      ? {
          showEmptyComp: false,
          showSelectComp: false,
          showDisplayComp: true,
          showFormComp: false,
        }
      : {
          showEmptyComp: true,
          showSelectComp: false,
          showDisplayComp: false,
          showFormComp: false,
        }
  );

  const [stateOptions, setStateOptions] = useState([]);

  useEffect(() => {
    groflexService
      .request(`${config.resourceHost}india/states`, { auth: true })
      .then((res) => {
        // console.log(res.data);
        const newStateOptions = res.body.data.map((state) => ({
          label: state.stateName,
          value: state.id,
        }));
        setStateOptions([...newStateOptions]);
      });
  }, []);

  const showEmpty = () => {
    setShowStates({
      showEmptyComp: true,
      showSelectComp: false,
      showDisplayComp: false,
      showFormComp: false,
    });
  };
  const showSelect = () => {
    setShowStates({
      showEmptyComp: false,
      showSelectComp: true,
      showDisplayComp: false,
      showFormComp: false,
    });
  };
  const showDisplay = () => {
    setShowStates({
      showEmptyComp: false,
      showSelectComp: false,
      showDisplayComp: true,
      showFormComp: false,
    });
  };
  const showForm = () => {
    setShowStates({
      showEmptyComp: false,
      showSelectComp: false,
      showDisplayComp: false,
      showFormComp: true,
    });
  };

  const handleSelectCustomer = (option) => {
    console.log(option, "CUSTOEMR SLECTED");
    const { exchangeRate, baseCurrency } = recipientComonentStates;
    if (
      option &&
      option.customerData &&
      option.customerData.countryIso !== "IN"
    ) {
      const newState = {
        ...recipientComonentStates,
        localCustomerData: option.customerData,
        localRecipientState: option
          ? RECIPIENT_STATE_CUSTOMER_SELECTED
          : RECIPIENT_STATE_EMPTY,
      };
      setRecipientComonentStates(
        newState
        //   () => {
        //   this.refreshRates(false);
        // }
      );
      onChange(option, baseCurrency, exchangeRate);
    } else {
      const newState = {
        ...recipientComonentStates,
        localCustomerData:
          option && option.customerData ? option.customerData : undefined,
        localRecipientState: option
          ? RECIPIENT_STATE_CUSTOMER_SELECTED
          : RECIPIENT_STATE_EMPTY,
      };
      setRecipientComonentStates(newState);
      onChange(option);
    }
    showDisplay();
  };

  const handleSelectAddOption = (option) => {
    console.log("NEW CUSTOMER SELECTED");
    const { currencyRates } = recipientComonentStates;
    setRecipientComonentStates({
      ...recipientComonentStates,
      localCustomerData: {
        kind: COMPANY,
        companyName: option.value,
        street: "",
        zipCode: "",
        city: "",
        gstNumber: "",
        cinNumber: "",
        mobile: "",
        countryIso: "",
        indiaState: Object.assign({ id: null, stateName: null }),
        type: recipientType,
        balance: 0,
        openingBalance: 0,
        exchangeRate: 0.0,
        baseCurrency: "",
        defaultExchangeRateToggle: false,
      },
      localRecipientState: RECIPIENT_STATE_FORM,
      baseCurrency: "",
      exchangeRate: 0.0,
    });
    showForm();
  };

  const handleDisplayClick = (event) => {
    showForm();
  };

  const handleRemoveDisplayClick = (event) => {
    setRecipientComonentStates({
      ...recipientComonentStates,
      localCustomerData: undefined,
      localRecipientState: RECIPIENT_STATE_EMPTY,
    });
    onChange && onChange();
    showEmpty();
  };

  const handleCloseForm = (newRecipientData) => {
    const newData = { ...newRecipientData };
    setRecipientComonentStates({
      ...recipientComonentStates,
      localCustomerData: {
        ...recipientComonentStates.localCustomerData,
        ...newData,
      },
    });
    showDisplay();
  };

  // console.log(showStates, "THE visibility STATES of all components");

  return (
    <>
      {showStates.showEmptyComp && (
        <RecipientEmptyComponent onClick={showSelect} />
      )}
      {showStates.showSelectComp && (
        <RecipientSelectComponent
          onSelect={handleSelectCustomer}
          onNewSelect={handleSelectAddOption}
          searchPayee={isPurchaseOrder}
          showEmpty={showEmpty}
        />
      )}
      {showStates.showDisplayComp && (
        <RecipientDisplayComponent
          customerData={recipientComonentStates.localCustomerData}
          baseCurrency={
            recipientComonentStates?.localCustomerData?.baseCurrency
          }
          exchangeRate={
            recipientComonentStates?.localCustomerData?.exchangeRate
          }
          onDisplayClick={handleDisplayClick}
          onRemoveClick={handleRemoveDisplayClick}
        />
      )}
      {showStates.showFormComp && (
        <RecipientFormComponent
          onBlur={handleCloseForm}
          customerData={recipientComonentStates.localCustomerData}
          stateOptions={stateOptions}
        />
      )}
    </>
  );
};

export default RecipientComponent;

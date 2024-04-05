import React, { useEffect, useState } from "react";
import {
  customerTypes,
  balanceLabels,
  balanceTypes,
} from "../../helpers/constants";
import RadioButton from "../components/button/RadioButton";
import OnClickOutside from "../components/onClickOutside/OnClickOutside";
import userPermissions from "../../enums/user-permissions.enum";
import resources from "../resources/resources";
import { getMiscellaneousData } from "../../helpers/getSettingsData";
import { multiFetchHandler } from "../../helpers/multiFetchHandler";
import { Input } from "../components/input/Input";
import { SelectInput } from "../components/select/SelectInput";
import RecipientFormPersonComponent from "./RecipientFormPersonComponent";
import RecipientFormCompanyComponent from "./RecipientFormCompanyComponent";
import groflexService from "../../services/groflex.service";
import config from "../../../../newConfig";

const { COMPANY, PERSON } = customerTypes;

const { NEW_CUSTOMER_LABEL, EXCESS_LABEL, DUES_LABEL, PAYEE_DUES_LABEL } =
  balanceLabels;

const { NEW_CUSTOMER, EXCESS, DUES } = balanceTypes;

// const CUSTOMER_TYPE_OPTIONS = [{ label: 'Firma', value: COMPANY }, { label: 'Privat', value: PERSON }];

const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;

const checkBoxChoices = [
  {
    label: "Company",
    value: "company",
    class: "is-outlined is-success",
    defaultClass: "p-t-0 p-l-0 p-b-0 p-r-20",
  },
  {
    label: "Private",
    value: "person",
    class: "is-outlined is-success",
    defaultClass: "p-0",
  },
];

const RecipientFormComponent = ({ onBlur, customerData, stateOptions }) => {
  const { kind } = customerData;

  const [recipientFormStates, setRecipientFormStates] = useState({
    toggledOpeningBalance: customerData.balance < 0 ? EXCESS : DUES,
    openingBalanceLabel: "",
    errorMessageMobile: "",
    canChangeAccountData: true,
    // invoiz.user &&
    // invoiz.user.hasPermission(userPermissions.CHANGE_ACCOUNT_DATA),
    planRestricted: true,
    // invoiz.user &&
    // invoiz.user.hasPlanPermission(planPermissions.NO_MULTICURRENCY),
  });

  const [selectedCustomerKind, setSelectedCustomerKind] = useState(
    kind || COMPANY
  );

  const handleCustomerKindChange = (option) => {
    setSelectedCustomerKind(option);
  };

  const handleBlur = (newRecipentData) => {
    onBlur({ kind: selectedCustomerKind, ...newRecipentData });
  };

  // console.log(salutationOptions, titleOptions, "OPTIONS IN FORM");
  // TODO: Add currency rate
  console.log(customerData, "CUSTOEMR DATA");

  return (
    <div className="p-10">
      {selectedCustomerKind === COMPANY && (
        <RecipientFormCompanyComponent
          stateOptions={stateOptions}
          customerData={customerData}
          onBlur={handleBlur}
          kindSelectorRadio={
            <RadioButton
              choices={checkBoxChoices}
              onChange={handleCustomerKindChange}
              selectedOption={selectedCustomerKind}
            />
          }
        />
      )}
      {selectedCustomerKind === PERSON && (
        <RecipientFormPersonComponent
          stateOptions={stateOptions}
          customerData={customerData}
          onBlur={handleBlur}
          kindSelectorRadio={
            <RadioButton
              choices={checkBoxChoices}
              onChange={handleCustomerKindChange}
              selectedOption={selectedCustomerKind}
            />
          }
        />
      )}
    </div>
  );
};

export default RecipientFormComponent;

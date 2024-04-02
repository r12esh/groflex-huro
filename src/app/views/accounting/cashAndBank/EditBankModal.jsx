import { useEffect, useState } from "react";
import Modal from "../../../shared/components/modal/Modal";
import { Input } from "../../../shared/components/input/Input";
import { FeatherIcon } from "../../../shared/featherIcon/FeatherIcon";
import { TextArea } from "../../../shared/components/textArea/TextArea";
import ErrorText from "../../../shared/components/errorText/ErrorText";
import { SelectInput } from "../../../shared/components/select/SelectInput";

// const bankNamesList = [
//   { label: "Bank Of Baroda", value: "Bank Of Baroda" },
//   { label: "Bank of Maharashtra", value: "Bank of Maharashtra" },
//   { label: "Canara Bank", value: "Canara Bank" },
//   { label: "Central Bank of India", value: "Central Bank of India" },
//   { label: "Indian Overseas Bank", value: "Indian Overseas Bank" },
//   { label: "Bank of India", value: "Bank of India" },
//   { label: "Indian Bank", value: "Indian Bank" },
// ];
const accountTypesList = [
  { label: "Savings", value: "savings" },
  { label: "Current", value: "current" },
];
const EditBankModal = ({
  isActive,
  setIsActive,
  onConfirm,
  initialBankData,
  modeToEdit,
}) => {
  const [reEnteredAccountNumber, setReEnteredAccountNumber] = useState(
    initialBankData.accountNumber || ""
  );
  const [newBankData, setNewBankData] = useState({
    type: "bank",
    bankName: initialBankData.bankName || "",
    accountNumber: initialBankData.accountNumber || "",
    accountType: initialBankData.accountType || "",
    accountName: initialBankData.accountName || "",
    IFSCCode: initialBankData.IFSCCode || "",
    openingBalance: initialBankData.openingBalance || "",
    branch: initialBankData.branch || "",
    customerId: initialBankData.customerId || "",
    notes: initialBankData.notes || "",
    cashType: "cash",
  });
  const [formErrors, setFormErrors] = useState({
    bankNameError: "",
    accountNumberError: "",
    accountNameError: "",
    reEnterAccountNumberError: "",
    // accountTypeError: "",
    IFSCCodeError: "",
    openingBalanceError: "",
  });
  useEffect(() => {
    setReEnteredAccountNumber(initialBankData.accountNumber);
    setNewBankData({
      type: "bank",
      bankName: initialBankData.bankName || "",
      accountNumber: initialBankData.accountNumber || "",
      accountType: initialBankData.accountType || "",
      accountName: initialBankData.accountName || "",
      IFSCCode: initialBankData.IFSCCode || "",
      openingBalance: initialBankData.openingBalance || "",
      branch: initialBankData.branch || "",
      customerId: initialBankData.customerId || "",
      notes: initialBankData.notes || "",
      cashType: "cash",
    });
  }, [initialBankData]);

  const handleBankNameChange = (event) => {
    setNewBankData({ ...newBankData, bankName: event.target.value });
    setFormErrors({ ...formErrors, bankNameError: "" });
  };

  const handleAccountNumberChange = (event) => {
    let enteredAccountNumber = event.target.value;

    if (/[^0-9]/.test(enteredAccountNumber)) return;

    if (!enteredAccountNumber) {
      setNewBankData({ ...newBankData, accountNumber: "" });
      return;
    }
    setNewBankData({ ...newBankData, accountNumber: enteredAccountNumber });
    setFormErrors({ ...formErrors, accountNumberError: "" });
    if (enteredAccountNumber === reEnteredAccountNumber) {
      setFormErrors({ ...formErrors, reEnterAccountNumberError: "" });
    }
  };

  const handleReEnterAccountNumberChange = (event) => {
    let reEnteredAccountNumber = event.target.value;

    if (/[^0-9]/.test(reEnteredAccountNumber)) return;

    if (!reEnteredAccountNumber) {
      setReEnteredAccountNumber("");
      return;
    }
    setReEnteredAccountNumber(reEnteredAccountNumber);
    if (reEnteredAccountNumber === newBankData.accountNumber) {
      setFormErrors({ ...formErrors, reEnterAccountNumberError: "" });
    } else {
      setFormErrors({
        ...formErrors,
        reEnterAccountNumberError: "Account number does not match",
      });
    }
  };

  const handleIfscCodeChange = (event) => {
    const enteredIfsc = event.target.value;

    if (enteredIfsc.length > 11 || /[^a-zA-Z0-9]/.test(enteredIfsc)) {
      return;
    }
    if (enteredIfsc.length < 11) {
      setNewBankData({ ...newBankData, IFSCCode: enteredIfsc });
      setFormErrors({
        ...formErrors,
        IFSCCodeError: "IFSC Code must be 11 digits",
      });
      return;
    }
    setNewBankData({ ...newBankData, IFSCCode: enteredIfsc });
    setFormErrors({ ...formErrors, IFSCCodeError: "" });
  };

  const handleStateChange = (option) => {
    if (!option) return;
    setNewBankData({
      ...newBankData,
      accountType: option.value,
      accountName: option.value,
    });
  };

  const handleOpeningBalanceChange = (value) => {
    let enteredOpeningBalance = event.target.value;

    if (/[^0-9]/.test(enteredOpeningBalance)) return;

    if (!enteredOpeningBalance) {
      setNewBankData({ ...newBankData, openingBalance: "" });
      return;
    }
    setNewBankData({ ...newBankData, openingBalance: event.target.value });
    setFormErrors({ ...formErrors, openingBalanceError: "" });
  };

  const handleBranchChange = (event) => {
    setNewBankData({ ...newBankData, branch: event.target.value });
  };

  const handleCustomerIdChange = (event) => {
    setNewBankData({ ...newBankData, customerId: event.target.value });
  };

  const handleDescriptionChange = (event) => {
    setNewBankData({ ...newBankData, notes: event.target.value });
  };

  const checkForEmptyFields = () => {
    let emptyFlag = false;
    if (!newBankData.bankName) {
      setFormErrors({
        ...formErrors,
        bankNameError: "This is a mandatory field",
      });
      // console.log(newBankData.bankName);
      emptyFlag = true;
    }
    if (!newBankData.accountNumber) {
      setFormErrors({
        ...formErrors,
        accountNumberError: "This is a mandatory field",
      });
      emptyFlag = true;
    }
    if (!reEnteredAccountNumber) {
      setFormErrors({
        ...formErrors,
        reEnterAccountNumberError: "This is a mandatory field",
      });
      emptyFlag = true;
    }

    if (!newBankData.IFSCCode) {
      setFormErrors({
        ...formErrors,
        IFSCCodeError: "This is a mandatory field",
      });
      emptyFlag = true;
    }
    if (!newBankData.openingBalance) {
      setFormErrors({
        ...formErrors,
        openingBalanceError: "This is a mandatory field",
      });
      emptyFlag = true;
    }
    return emptyFlag;
  };

  const handleSave = () => {
    //Check for empty fields
    if (checkForEmptyFields()) return;

    //check for reentered acc number
    if (newBankData.accountNumber !== reEnteredAccountNumber) {
      setFormErrors({
        ...formErrors,
        reEnterAccountNumberError: "Account number does not match",
      });
      return;
    }

    //Finally submitting if no errors of any type
    if (Object.values(formErrors).every((error) => error === "")) {
      onConfirm(newBankData, setNewBankData, setReEnteredAccountNumber);
    }
  };

  // console.log("Add bank Form data", newBankData);
  // console.log("Add bank Form errors", formErrors);
  // console.log(newBankData.openingBalance);
  // console.log(initialBankData);
  return (
    <Modal
      title={modeToEdit ? "Edit bank details" : "Add bank account details"}
      submitBtnName="Save"
      isActive={isActive}
      setIsAcive={setIsActive}
      onSubmit={handleSave}
      isMedium
    >
      <form onSubmit={handleSave}>
        <div className="columns">
          <div className="column is-12">
            <div className="field">
              <label>Bank Name*</label>
              <div style={{ fontWeight: "400", fontSize: "14px" }}>
                <Input
                  hasError={formErrors.bankNameError}
                  value={newBankData.bankName}
                  onChange={handleBankNameChange}
                  disabled={modeToEdit}
                />
              </div>
              <ErrorText
                style={{ textAlign: "left" }}
                visible={formErrors.bankNameError}
                text={formErrors.bankNameError}
              />
            </div>
          </div>
        </div>

        <div className="columns is-multiline">
          <div className="column is-6">
            <div className="field">
              <label>Account number*</label>
              <Input
                hasError={formErrors.accountNumberError}
                onChange={handleAccountNumberChange}
                value={newBankData.accountNumber}
                helpText={formErrors.accountNumberError}
              />
            </div>
          </div>
          <div className="column is-6">
            <div className="field">
              <label>Confirm account number*</label>
              <Input
                hasError={formErrors.reEnterAccountNumberError}
                onChange={handleReEnterAccountNumberChange}
                value={reEnteredAccountNumber}
                helpText={formErrors.reEnterAccountNumberError}
              />
            </div>
          </div>
          <div className="column is-6">
            <div className="field">
              <label>Account Type*</label>
              <div style={{ fontWeight: "400", fontSize: "14px" }}>
                <SelectInput
                  onChange={handleStateChange}
                  loadedOptions={accountTypesList}
                  value={newBankData.accountType}
                  options={accountTypesList}
                />
              </div>
              <ErrorText
                style={{ textAlign: "left" }}
                visible={formErrors.accountNameError}
                text={formErrors.accountNameError}
              />
            </div>
          </div>
          <div className="column is-6">
            <div className="field">
              <label>
                IFSC code*{" "}
                <FeatherIcon
                  style={{ height: "14px", with: "14px" }}
                  name={"HelpCircle"}
                />
              </label>
              <Input
                hasError={formErrors.IFSCCodeError}
                value={newBankData.IFSCCode}
                onChange={handleIfscCodeChange}
                helpText={formErrors.IFSCCodeError}
              />
            </div>
          </div>
        </div>

        <div className=" field">
          <label>Opening balance*</label>
          <Input
            hasError={formErrors.openingBalanceError}
            onChange={handleOpeningBalanceChange}
            value={newBankData.openingBalance}
            helpText={formErrors.openingBalanceError}
            disabled={modeToEdit}
          />
        </div>

        <div className="columns is-multiline  ">
          <div className="column is-6">
            <div className="field">
              <label>Branch</label>
              <Input onChange={handleBranchChange} value={newBankData.branch} />
            </div>
          </div>
          <div className="column is-6">
            <div className="field">
              <label>Customer ID</label>
              <Input
                onChange={handleCustomerIdChange}
                value={newBankData.customerId}
              />
            </div>
          </div>
        </div>

        <div className=" field">
          <label>Description</label>
          <TextArea
            value={newBankData.notes}
            onChange={handleDescriptionChange}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditBankModal;
